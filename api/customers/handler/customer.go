package handler

import (
	"context"
	"encoding/json"
	"math/rand"
	"strings"
	"time"

	"github.com/google/uuid"
	"m3o.dev/platform/util/auth/namespace"

	apiproto "m3o.dev/platform/proto/api"
	aproto "m3o.dev/platform/proto/auth"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/auth"
	mauth "m3o.dev/platform/service/auth/client"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/errors"
	mevents "m3o.dev/platform/service/events"
	log "m3o.dev/platform/service/logger"
	mstore "m3o.dev/platform/service/store"
	customer "m3o.dev/api/customers/proto"
	eventspb "m3o.dev/api/pkg/events/proto/customers"
)

type Customers struct {
	accountsService aproto.AccountsService
	apiService      apiproto.ApiService
	auth            auth.Auth
}

const (
	statusUnverified = "unverified"
	statusVerified   = "verified"
	statusActive     = "active"
	statusDeleted    = "deleted"
	statusBanned     = "banned"

	prefixCustomer      = "customers/"
	prefixCustomerEmail = "email/"

	microNamespace = "micro"
)

var validStatus = map[string]bool{
	statusUnverified: true,
	statusVerified:   true,
	statusActive:     true,
	statusDeleted:    true,
}

type CustomerModel struct {
	ID      string
	Email   string
	Status  string
	Created int64
	Updated int64
	Name    string
	Meta    map[string]string
}

func New(service *service.Service) *Customers {
	c := &Customers{
		accountsService: aproto.NewAccountsService("auth", service.Client()),
		apiService:      apiproto.NewApiService("api", service.Client()),
		auth:            mauth.NewAuth(),
	}
	return c
}

func objToProto(cust *CustomerModel) *customer.Customer {
	return &customer.Customer{
		Id:      cust.ID,
		Status:  cust.Status,
		Created: cust.Created,
		Email:   cust.Email,
		Updated: cust.Updated,
		Name:    cust.Name,
		Meta:    cust.Meta,
	}
}

func objToEvent(cust *CustomerModel) *eventspb.Customer {
	return &eventspb.Customer{
		Id:      cust.ID,
		Status:  cust.Status,
		Created: cust.Created,
		Email:   cust.Email,
		Updated: cust.Updated,
		Name:    cust.Name,
		Meta:    cust.Meta,
	}
}

func (c *Customers) Create(ctx context.Context, request *customer.CreateRequest, response *customer.CreateResponse) error {
	acc, err := authorizeCall(ctx, "")
	if err != nil {
		return err
	}
	email := request.Email
	if email == "" {
		// try deprecated fallback
		email = request.Id
	}
	if strings.TrimSpace(email) == "" {
		return errors.BadRequest("customers.create", "Email is required")
	}
	// have we seen this before?
	var cust *CustomerModel
	existingCust, err := readCustomerByEmail(email)
	if err != nil {
		if !strings.Contains(err.Error(), "not found") {
			return err
		}
		// not seen before so let's mint a new customer object
		cust = &CustomerModel{
			ID:     uuid.New().String(),
			Status: statusUnverified,
			Email:  email,
		}
	} else {
		if existingCust.Status == statusUnverified {
			// idempotency
			cust = existingCust
		} else {
			return errors.BadRequest("customers.create.exists", "Customer with this email already exists")
		}
	}

	if err := writeCustomer(cust); err != nil {
		return err
	}
	response.Customer = objToProto(cust)

	// Publish the event
	ev := &eventspb.Event{
		Type:     eventspb.EventType_EventTypeCreated,
		CallerId: acc.ID,
		Created:  &eventspb.Created{},
		Customer: objToEvent(cust),
	}

	if err := mevents.Publish(eventspb.Topic, ev); err != nil {
		log.Errorf("Error publishing event %+v", ev)
	}

	return nil
}

func (c *Customers) MarkVerified(ctx context.Context, request *customer.MarkVerifiedRequest, response *customer.MarkVerifiedResponse) error {
	email := request.Email
	if email == "" {
		// try deprecated fallback
		email = request.Id
	}

	if strings.TrimSpace(email) == "" {
		return errors.BadRequest("customers.markverified", "Email is required")
	}

	cust, err := readCustomerByEmail(email)
	if err != nil {
		return err
	}
	acc, err := authorizeCall(ctx, cust.ID)
	if err != nil {
		return err
	}

	cus, err := updateCustomerStatusByEmail(email, statusVerified)
	if err != nil {
		return err
	}

	// Publish the event
	ev := &eventspb.Event{
		Type:     eventspb.EventType_EventTypeVerified,
		Customer: objToEvent(cus),
		CallerId: acc.ID,
	}
	if err := mevents.Publish(eventspb.Topic, ev); err != nil {
		log.Errorf("Error publishing event %+v %s", ev, err)
	}

	return nil
}

func readCustomerByID(customerID string) (*CustomerModel, error) {
	return readCustomer(customerID, prefixCustomer)
}

func readCustomerByEmail(email string) (*CustomerModel, error) {
	return readCustomer(email, prefixCustomerEmail)
}

func readCustomer(id, prefix string) (*CustomerModel, error) {
	recs, err := mstore.Read(prefix + id)
	if err != nil {
		return nil, err
	}
	if len(recs) != 1 {
		return nil, errors.InternalServerError("customers.read.toomanyrecords", "Cannot find record to update")
	}
	rec := recs[0]
	cust := &CustomerModel{}
	if err := json.Unmarshal(rec.Value, cust); err != nil {
		return nil, err
	}
	if cust.Status == statusDeleted {
		return nil, errors.NotFound("customers.read.notfound", "Customer not found")
	}

	// hack
	if cust.Meta == nil {
		cust.Meta = map[string]string{}
	}
	if cust.Meta["generated_name"] == "" {
		cust.Meta["generated_name"] = superheroes[rand.Int()%len(superheroes)]
	}
	writeCustomer(cust)
	return cust, nil
}

func (c *Customers) Read(ctx context.Context, request *customer.ReadRequest, response *customer.ReadResponse) error {
	if strings.TrimSpace(request.Id) == "" && strings.TrimSpace(request.Email) == "" {
		return errors.BadRequest("customers.read", "ID or Email is required")
	}
	var cust *CustomerModel
	var err error
	if request.Id != "" {
		cust, err = readCustomerByID(request.Id)
	} else {
		cust, err = readCustomerByEmail(request.Email)
	}
	if err != nil {
		return err
	}
	if _, err := authorizeCall(ctx, cust.ID); err != nil {
		return err
	}
	response.Customer = objToProto(cust)
	return nil
}

func (c *Customers) Delete(ctx context.Context, request *customer.DeleteRequest, response *customer.DeleteResponse) error {
	if strings.TrimSpace(request.Id) == "" && strings.TrimSpace(request.Email) == "" {
		return errors.BadRequest("customers.delete", "ID or Email is required")
	}
	if len(request.Id) == 0 {
		c, err := readCustomerByEmail(request.Email)
		if err != nil {
			return err
		}
		request.Id = c.ID
	}
	if _, err := authorizeCall(ctx, request.Id); err != nil {
		return err
	}

	if err := c.deleteCustomer(ctx, request.Id, request.Force); err != nil {
		log.Errorf("Error deleting customer %s %s", request.Id, err)
		return errors.InternalServerError("customers.delete", "Error deleting customer")
	}
	return nil
}

func updateCustomerStatusByEmail(email, status string) (*CustomerModel, error) {
	return updateCustomerStatus(email, status, prefixCustomerEmail)
}

func updateCustomerStatusByID(id, status string) (*CustomerModel, error) {
	return updateCustomerStatus(id, status, prefixCustomer)
}

func updateCustomerStatus(id, status, prefix string) (*CustomerModel, error) {
	cust, err := readCustomer(id, prefix)
	if err != nil {
		return nil, err
	}
	cust.Status = status
	if err := writeCustomer(cust); err != nil {
		return nil, err
	}
	return cust, nil
}

func writeCustomer(cust *CustomerModel) error {
	now := time.Now().Unix()
	if cust.Created == 0 {
		cust.Created = now
	}
	cust.Updated = now
	if cust.Meta == nil {
		cust.Meta = map[string]string{}
	}
	if cust.Meta["generated_name"] == "" {
		cust.Meta["generated_name"] = superheroes[rand.Int()%len(superheroes)]
	}

	b, _ := json.Marshal(*cust)
	if err := mstore.Write(&mstore.Record{
		Key:   prefixCustomer + cust.ID,
		Value: b,
	}); err != nil {
		return err
	}

	if err := mstore.Write(&mstore.Record{
		Key:   prefixCustomerEmail + cust.Email,
		Value: b,
	}); err != nil {
		return err
	}
	return nil
}

func authorizeCall(ctx context.Context, customerID string) (*auth.Account, error) {
	account, ok := auth.AccountFromContext(ctx)
	if !ok {
		return nil, errors.Unauthorized("customers", "Unauthorized request")
	}
	if account.Issuer != microNamespace {
		return nil, errors.Unauthorized("customers", "Unauthorized request")
	}
	if account.Type == "customer" && account.ID == customerID {
		return account, nil
	}
	if account.Type == "user" && hasScope("admin", account.Scopes) {
		return account, nil
	}
	if account.Type == "service" {
		return account, nil
	}
	return nil, errors.Unauthorized("customers", "Unauthorized request")
}

func authorizeAdmin(ctx context.Context) error {
	account, ok := auth.AccountFromContext(ctx)
	if !ok {
		return errors.Unauthorized("customers", "Unauthorized request")
	}
	if account.Issuer != microNamespace {
		return errors.Unauthorized("customers", "Unauthorized request")
	}
	if account.Type == "user" && hasScope("admin", account.Scopes) {
		return nil
	}
	if account.Type == "service" {
		return nil
	}
	return errors.Unauthorized("customers", "Unauthorized request")
}

func hasScope(scope string, scopes []string) bool {
	for _, sc := range scopes {
		if sc == scope {
			return true
		}
	}
	return false
}

func (c *Customers) deleteCustomer(ctx context.Context, customerID string, force bool) error {
	_, err := c.accountsService.Delete(ctx, &aproto.DeleteAccountRequest{
		Id:      customerID,
		Options: &aproto.Options{Namespace: microNamespace},
	}, client.WithAuthToken())
	if ignoreDeleteError(err) != nil {
		return err
	}

	var cust *CustomerModel
	// delete customer
	if !force {
		cust, err = updateCustomerStatusByID(customerID, statusDeleted)
		if err != nil {
			return err
		}
	} else {
		// actually delete not just update the status
		cust, err = c.forceDelete(customerID)
		if err != nil {
			return err
		}

	}

	// Publish the event
	var callerID string
	if acc, ok := auth.AccountFromContext(ctx); ok {
		callerID = acc.ID
	}
	ev := &eventspb.Event{
		Type:     eventspb.EventType_EventTypeDeleted,
		Customer: objToEvent(cust),
		CallerId: callerID,
	}
	if err := mevents.Publish(eventspb.Topic, ev); err != nil {
		log.Errorf("Error publishing event %+v", ev)
	}

	return nil
}

func (c *Customers) forceDelete(customerID string) (*CustomerModel, error) {
	cust, err := readCustomer(customerID, prefixCustomer)
	if err != nil {
		return nil, err
	}
	if err := mstore.Delete(prefixCustomerEmail + cust.Email); err != nil {
		return nil, err
	}
	if err := mstore.Delete(prefixCustomer + customerID); err != nil {
		return nil, err
	}

	return cust, nil
}

// ignoreDeleteError will ignore any 400 or 404 errors returned, useful for idempotent deletes
func ignoreDeleteError(err error) error {
	if err != nil {
		merr, ok := err.(*errors.Error)
		if !ok {
			return err
		}
		if merr.Code == 400 || merr.Code == 404 {
			return nil
		}
		return err
	}
	return nil
}

// List is a temporary endpoint which will very quickly become unusable due to the way it lists entries
func (c *Customers) List(ctx context.Context, request *customer.ListRequest, response *customer.ListResponse) error {
	if err := authorizeAdmin(ctx); err != nil {
		return errors.Unauthorized("customers", "Unauthorized")
	}

	recs, err := mstore.Read(prefixCustomer, mstore.ReadPrefix())
	if err != nil {
		return err
	}
	res := []*customer.Customer{}
	for _, rec := range recs {
		cust := &CustomerModel{}
		if err := json.Unmarshal(rec.Value, cust); err != nil {
			return err
		}
		if cust.Status == statusDeleted {
			// skip
			continue
		}

		res = append(res, &customer.Customer{
			Id:      cust.ID,
			Status:  cust.Status,
			Created: cust.Created,
			Email:   cust.Email,
			Updated: cust.Updated,
		})
	}
	response.Customers = res
	return nil
}

func (c *Customers) Update(ctx context.Context, request *customer.UpdateRequest, response *customer.UpdateResponse) error {
	if err := authorizeAdmin(ctx); err != nil {
		return err
	}
	cust, err := readCustomerByID(request.Customer.Id)
	if err != nil {
		return err
	}
	changed := false
	if len(request.Customer.Status) > 0 {
		if !validStatus[request.Customer.Status] {
			return errors.BadRequest("customers.update.badstatus", "Invalid status passed")
		}
		if cust.Status != request.Customer.Status {
			cust.Status = request.Customer.Status
			changed = true
		}
	}

	if cust.Name != request.Customer.Name {
		cust.Name = request.Customer.Name
		changed = true
	}

	if len(cust.Meta) != len(request.Customer.Meta) {
		cust.Meta = request.Customer.Meta
		changed = true
	} else {
		for k, v := range request.Customer.Meta {
			if cust.Meta[k] != v {
				cust.Meta = request.Customer.Meta
				changed = true
				break
			}
		}
	}

	// TODO support email changing - would require reverification
	if !changed {
		return nil
	}

	// Publish the event
	var callerID string
	if acc, ok := auth.AccountFromContext(ctx); ok {
		callerID = acc.ID
	}
	ev := &eventspb.Event{
		Type:     eventspb.EventType_EventTypeUpdated,
		Customer: objToEvent(cust),
		CallerId: callerID,
	}
	if err := mevents.Publish(eventspb.Topic, ev); err != nil {
		log.Errorf("Error publishing event %+v", ev)
	}

	return writeCustomer(cust)
}

func (c *Customers) Ban(ctx context.Context, request *customer.BanRequest, response *customer.BanResponse) error {
	//Account is disabled such that
	//- cannot use existing keys
	//- cannot create new keys
	//- cannot sign up with the same email address (it's still in use just not usable)
	//
	if err := authorizeAdmin(ctx); err != nil {
		return err
	}

	var cm *CustomerModel
	var err error
	if len(request.Id) > 0 {
		cm, err = readCustomerByID(request.Id)
		if err != nil {
			log.Errorf("Error banning customer %s", err)
			return errors.InternalServerError("customers.ban", "Error while banning customer")
		}
	} else if len(request.Email) > 0 {
		var err error
		cm, err = readCustomerByEmail(request.Email)
		if err != nil {
			log.Errorf("Error banning customer %s", err)
			return errors.InternalServerError("customers.ban", "Error while banning customer")
		}
	} else {
		return errors.BadRequest("customers.ban", "Please specify either email or ID")
	}

	cm, err = updateCustomerStatusByID(cm.ID, statusBanned)
	if err != nil {
		return errors.InternalServerError("customers.ban", "Error banning customer %s", err)
	}

	if _, err := c.accountsService.Delete(ctx, &aproto.DeleteAccountRequest{
		Id: cm.ID,
	}); err != nil {
		log.Errorf("Error deleting account %s", err)
		return err
	}

	// Block the user at the API to kill any existing JWTs
	_, err = c.apiService.AddToBlockList(ctx, &apiproto.AddToBlockListRequest{Id: cm.ID, Namespace: namespace.DefaultNamespace})
	if err != nil {
		log.Errorf("Error blocking customer at API, %s", err)
		return err
	}
	var callerID string
	if acc, ok := auth.AccountFromContext(ctx); ok {
		callerID = acc.ID
	}
	ev := &eventspb.Event{
		Type:     eventspb.EventType_EventTypeBanned,
		Customer: objToEvent(cm),
		CallerId: callerID,
	}
	if err := mevents.Publish(eventspb.Topic, ev); err != nil {
		log.Errorf("Error publishing event %+v", ev)
	}

	return nil
}

func (c *Customers) Unban(ctx context.Context, request *customer.UnbanRequest, response *customer.UnbanResponse) error {
	if err := authorizeAdmin(ctx); err != nil {
		return err
	}
	var cm *CustomerModel
	var err error
	if len(request.Id) > 0 {
		cm, err = readCustomerByID(request.Id)
		if err != nil {
			log.Errorf("Error unbanning customer %s", err)
			return errors.InternalServerError("customers.unban", "Error while unbanning customer")
		}
	} else if len(request.Email) > 0 {
		var err error
		cm, err = readCustomerByEmail(request.Email)
		if err != nil {
			log.Errorf("Error unbanning customer %s", err)
			return errors.InternalServerError("customers.unban", "Error while unbanning customer")
		}
	} else {
		return errors.BadRequest("customers.ban", "Please specify either email or ID")
	}

	cm, err = updateCustomerStatusByID(cm.ID, statusVerified)
	if err != nil {
		log.Errorf("Error unbanning customer %s", err)
		return errors.InternalServerError("customers.unban", "Error unbanning customer %s", err)
	}

	// create a new account
	if _, err := c.createAuthAccount(ctx, cm.ID, cm.Email); err != nil {
		return err
	}

	// Unblock the user at the API
	_, err = c.apiService.RemoveFromBlockList(ctx, &apiproto.RemoveFromBlockListRequest{Id: cm.ID, Namespace: namespace.DefaultNamespace})
	if err != nil {
		log.Errorf("Error unblocking customer at API, %s", err)
		return err
	}

	var callerID string
	if acc, ok := auth.AccountFromContext(ctx); ok {
		callerID = acc.ID
	}
	ev := &eventspb.Event{
		Type:     eventspb.EventType_EventTypeUnbanned,
		Customer: objToEvent(cm),
		CallerId: callerID,
	}
	if err := mevents.Publish(eventspb.Topic, ev); err != nil {
		log.Errorf("Error publishing event %+v", ev)
	}

	return nil
}

func (c *Customers) createAuthAccount(ctx context.Context, id, email string) (*auth.Account, error) {
	// generate a random secret and get the user to do a password reset
	secret := uuid.New().String()

	acc, err := c.auth.Generate(id,
		auth.WithScopes("customer"),
		auth.WithSecret(secret),
		auth.WithIssuer(microNamespace),
		auth.WithName(email),
		auth.WithType("customer"))
	if err != nil {
		log.Errorf("Error creating auth account for %v: %v", id, err)
		return nil, errors.InternalServerError("customers.account", "Error generating account")
	}
	return acc, nil
}

func (c *Customers) Login(ctx context.Context, request *customer.LoginRequest, response *customer.LoginResponse) error {
	opts := []auth.TokenOption{
		auth.WithTokenIssuer(microNamespace),
		auth.WithExpiry(24 * time.Hour * 30),
	}
	if len(request.RefreshToken) > 0 {
		opts = append(opts, auth.WithToken(request.RefreshToken))
	}

	if len(request.Password) > 0 {
		opts = append(opts, auth.WithCredentials(request.Email, request.Password))
	}
	tok, err := c.auth.Token(opts...)
	if err != nil {
		if merr, ok := err.(*errors.Error); ok {
			if merr.Code == 400 {
				return errors.BadRequest("customers.login", merr.Detail)
			}
			return errors.InternalServerError("customers.login", "Error attempting to log in. Please try again later")
		}

	}
	response.Token = &customer.Token{
		AccessToken:  tok.AccessToken,
		RefreshToken: tok.RefreshToken,
		Expiry:       tok.Expiry.Unix(),
	}

	go func() {
		acc, err := c.auth.Inspect(tok.AccessToken)
		if err != nil {
			log.Errorf("Error inspecting generated token")
			return
		}
		cust, err := readCustomerByID(acc.ID)
		if err != nil {
			log.Errorf("Error reading customer %s", err)
			return
		}
		// is this a login or a refresh?
		if len(request.Password) > 0 {
			mevents.Publish(eventspb.Topic, &eventspb.Event{
				Type:     eventspb.EventType_EventTypeLogin,
				Customer: objToEvent(cust),
				Login:    &eventspb.Login{Method: "email"},
			})
		} else {
			mevents.Publish(eventspb.Topic, &eventspb.Event{
				Type:         eventspb.EventType_EventTypeTokenRefresh,
				Customer:     objToEvent(cust),
				TokenRefresh: &eventspb.TokenRefresh{},
			})
		}
	}()

	return nil
}

func (c *Customers) Logout(ctx context.Context, request *customer.LogoutRequest, response *customer.LogoutResponse) error {
	acc, ok := auth.AccountFromContext(ctx)
	if !ok {
		// ignore
		return nil
	}
	go func() {
		cust, err := readCustomerByID(acc.ID)
		if err != nil {
			log.Errorf("Error reading customer %s", err)
			return
		}
		mevents.Publish(eventspb.Topic, &eventspb.Event{
			Type:     eventspb.EventType_EventTypeLogout,
			Customer: objToEvent(cust),
			Logout:   &eventspb.Logout{},
		})
	}()

	return nil
}

func (c *Customers) UpdateName(ctx context.Context, request *customer.UpdateNameRequest, response *customer.UpdateNameResponse) error {
	acc, err := authorizeCall(ctx, request.Id)
	if err != nil {
		return errors.Forbidden("customers.UpdateName", "Forbidden")
	}

	cust, err := readCustomerByID(request.Id)
	if err != nil {
		log.Errorf("Error reading customer %s", err)
		return errors.InternalServerError("customers.UpdateName", "Error updating name")
	}

	ev := &eventspb.Event{
		Type:     eventspb.EventType_EventTypeUpdated,
		Customer: objToEvent(cust),
		CallerId: acc.ID,
	}
	if err := mevents.Publish(eventspb.Topic, ev); err != nil {
		log.Errorf("Error publishing event %+v", ev)
	}
	cust.Name = request.Name

	return writeCustomer(cust)
}
