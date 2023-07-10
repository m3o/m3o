package handler

import (
	"bytes"
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt"
	pbapi "m3o.dev/platform/proto/api"
	authpb "m3o.dev/platform/proto/auth"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/api"
	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/context/metadata"
	"m3o.dev/platform/service/errors"
	"m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/registry"
	"m3o.dev/platform/service/server"
	"m3o.dev/platform/service/store"
	alertpb "m3o.dev/api/alerts/proto"
	balance "m3o.dev/api/balance/proto"
	billing "m3o.dev/api/billing/proto"
	m3oauth "m3o.dev/api/pkg/auth"
	"m3o.dev/api/pkg/events/proto/requests"
	projects "m3o.dev/api/projects/proto"
	publicapi "m3o.dev/api/publicapi/proto"
	usage "m3o.dev/api/usage/proto"
	v1 "m3o.dev/api/v1/proto"
)

const (
	keyCachePrefix         = "v1-service/keycache"
	defaultMonthlyUsageCap = 1000000
)

type V1 struct {
	accsvc         authpb.AccountsService
	keyRecCache    expiringLRUCache
	balanceCache   *balanceCache
	usageCache     *usageCache
	publicapiCache *publicapiCache
	alerts         alertpb.AlertsService
	limiter        *limiter
	config         cfg
	projSvc        projects.ProjectsService
	tierCache      *tierCache
}

type cfg struct {
	RateLimits map[string]int64 `json:"rate-limits"`
}

const (
	storePrefixHashedKey = "hashed"
	storePrefixUserID    = "user"
	storePrefixKeyID     = "key"

	lruCacheTTL = 5 * time.Minute
)

var (
	errUnauthorized = errors.Unauthorized("v1", "Unauthorized")
	errInternal     = errors.InternalServerError("v1", "Error processing request")
)

func NewHandler(srv *service.Service) *V1 {
	redisConfig := struct {
		Address  string
		User     string
		Password string
	}{}

	val, err := config.Get("micro.v1.redis")
	if err != nil {
		log.Fatalf("No redis config found %s", err)
	}
	if err := val.Scan(&redisConfig); err != nil {
		log.Fatalf("Error parsing redis config %s", err)
	}
	if len(redisConfig.Password) == 0 || len(redisConfig.User) == 0 || len(redisConfig.Password) == 0 {
		log.Fatalf("Missing redis config %s", err)
	}
	rc := redis.NewClient(&redis.Options{
		Addr:     redisConfig.Address,
		Username: redisConfig.User,
		Password: redisConfig.Password,
		TLSConfig: &tls.Config{
			InsecureSkipVerify: false,
		},
	})
	papi := publicapi.NewPublicapiService("publicapi", srv.Client())
	keyRecCache := expiringRedisCache{redisClient: rc, ttl: lruCacheTTL}
	papiCache := &publicapiCache{
		apis: map[string]*publicapi.PublicAPI{},
		papi: papi,
	}
	if err := papiCache.init(); err != nil {
		log.Fatalf("Failed to init public API cache %s", err)
	}
	val, err = config.Get("micro.v1")
	if err != nil {
		log.Fatalf("Failed to load config")
	}
	var conf cfg
	if err := val.Scan(&conf); err != nil {
		log.Fatalf("Failed to load config %s", err)
	}
	if len(conf.RateLimits) == 0 {
		log.Fatalf("Failed to load rate limits config")
	}
	tc := &tierCache{
		billingSvc: billing.NewBillingService("billing", srv.Client()),
		tiers:      map[string]string{},
	}
	tc.init()
	v1api := &V1{
		accsvc:         authpb.NewAccountsService("auth", srv.Client()),
		keyRecCache:    &keyRecCache,
		publicapiCache: papiCache,
		balanceCache: &balanceCache{
			balsvc: balance.NewBalanceService("balance", srv.Client()),
		},
		usageCache: &usageCache{
			usagesvc: usage.NewUsageService("usage", srv.Client()),
		},
		alerts:    alertpb.NewAlertsService("alerts", srv.Client()),
		limiter:   &limiter{c: rc},
		config:    conf,
		projSvc:   projects.NewProjectsService("projects", srv.Client()),
		tierCache: tc,
	}
	v1api.consumeEvents()
	return v1api
}

func (v1 *V1) writeAPIRecord(ctx context.Context, rec *apiKeyRecord) error {
	b, err := json.Marshal(rec)
	if err != nil {
		return err
	}

	// store under hashed key for API usage
	if err := store.Write(&store.Record{
		Key:   fmt.Sprintf("%s:%s", storePrefixHashedKey, rec.ApiKey),
		Value: b,
	}); err != nil {
		return err
	}

	// store under the user ID for retrieval on dashboard
	if err := store.Write(&store.Record{
		Key:   fmt.Sprintf("%s:%s:%s:%s", storePrefixUserID, rec.Namespace, rec.UserID, rec.ApiKey),
		Value: b,
	}); err != nil {
		return err
	}

	// store under the key's ID for deletion
	if err := store.Write(&store.Record{
		Key:   fmt.Sprintf("%s:%s:%s:%s", storePrefixKeyID, rec.Namespace, rec.UserID, rec.ID),
		Value: b,
	}); err != nil {
		return err
	}

	v1.keyRecCache.Add(ctx, rec.ApiKey, rec)
	return nil
}

func (v1 *V1) deleteAPIRecord(ctx context.Context, rec *apiKeyRecord) error {
	// store under hashed key for API usage
	if err := store.Delete(fmt.Sprintf("%s:%s", storePrefixHashedKey, rec.ApiKey)); err != nil {
		return err
	}

	// store under the user ID for retrieval on dashboard
	if err := store.Delete(fmt.Sprintf("%s:%s:%s:%s", storePrefixUserID, rec.Namespace, rec.UserID, rec.ApiKey)); err != nil {
		return err
	}

	// store under the key's ID for deletion
	if err := store.Delete(fmt.Sprintf("%s:%s:%s:%s", storePrefixKeyID, rec.Namespace, rec.UserID, rec.ID)); err != nil {
		return err
	}
	v1.keyRecCache.Remove(ctx, rec.ApiKey)

	return nil
}

func readAPIRecordByKeyID(ns, user, keyID string) (*apiKeyRecord, error) {
	recs, err := store.Read(fmt.Sprintf("%s:%s:%s:%s", storePrefixKeyID, ns, user, keyID))
	if err != nil {
		return nil, err
	}

	rec := recs[0]
	keyRec := &apiKeyRecord{}
	if err := json.Unmarshal(rec.Value, keyRec); err != nil {
		return nil, err
	}
	return keyRec, nil
}

func hashSecret(s string) (string, error) {
	h := sha256.New()
	h.Write([]byte(s))
	h.Sum(nil)
	return fmt.Sprintf("%x", h.Sum(nil)), nil
}

// checkRequestedScopes returns true if account has sufficient privileges for them to generate the requestedScopes.
func (v1 *V1) checkRequestedScopes(ctx context.Context, requestedScopes []string) bool {
	allowedScopes, err := v1.listAPIs()
	if err != nil {
		// fail closed
		return false
	}
	// add wildcard
	allowedScopes = append(allowedScopes, "*")
	for _, requested := range requestedScopes {
		found := false
		for _, allowed := range allowedScopes {
			if allowed == requested {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return true
}

func (v1 *V1) readAPIRecordByAPIKey(ctx context.Context, authz string) (string, *apiKeyRecord, error) {
	if len(authz) == 0 || (!strings.HasPrefix(authz, "Bearer ") && !strings.HasPrefix(authz, "Basic ")) {
		return "", nil, errUnauthorized
	}
	var key string
	if strings.HasPrefix(authz, "Bearer ") {
		key = authz[7:]
	} else {
		b, err := base64.StdEncoding.DecodeString(authz[6:])
		if err != nil {
			return "", nil, errUnauthorized
		}
		parts := strings.SplitN(string(b), ":", 2)
		if len(parts) != 2 {
			return "", nil, errUnauthorized
		}

		key = parts[1]
	}
	// do lookup on hash of key

	hashed, err := hashSecret(key)
	if err != nil {
		return "", nil, errUnauthorized
	}

	rec, err := v1.keyRecCache.GetAPIKeyRecord(ctx, hashed)
	if err == nil {
		return key, rec, nil
	}

	recs, err := store.Read(fmt.Sprintf("%s:%s", storePrefixHashedKey, hashed))
	if err != nil {
		if err != store.ErrNotFound {
			log.Errorf("Error while looking up api key %s", err)
		}
		// not found == invalid (or even revoked)
		log.Infof("Authz not found %+v", hashed)
		return "", nil, errUnauthorized
	}
	// rehydrate
	apiRec := apiKeyRecord{}
	if err := json.Unmarshal(recs[0].Value, &apiRec); err != nil {
		log.Errorf("Error while rehydrating api key record %s", err)
		return "", nil, errUnauthorized
	}
	v1.keyRecCache.Add(ctx, hashed, &apiRec)

	return key, &apiRec, nil
}

func (v1 *V1) checkPrice(ctx context.Context, reqURL string) (int64, error) {
	apiName, endpointName, err := getApiEndpointFromURL(reqURL)
	if err != nil {
		return 0, err
	}
	price := v1.publicapiCache.getPrice(apiName, endpointName)
	return price, nil
}

// verifyCallAllowed checks whether we should allow this request.
// If OK it returns
// - the price that should be charged; "free" indicates a free endpoint, "0" indicates a paid endpoint that's using free quota, "[0-9]+" indicates the price
func (v1 *V1) verifyCallAllowed(ctx context.Context, apiRec *apiKeyRecord, reqURL string) (string, error) {
	// checks
	// 1. Has the key been explicitly blocked?
	// 2. Do the scopes of the token allow them to call the requested API? The name of the scopes correspond to the service
	// 3. Do we have sufficient money to call this endpoint
	// 4. Rate limiting
	// 5. Usage caps

	type balRes struct {
		bal int64
		err error
	}
	balChan := make(chan balRes)
	go func() {
		bal, err := v1.balanceCache.getBalance(ctx, apiRec.UserID)
		balChan <- balRes{
			bal: bal,
			err: err,
		}
	}()

	service, endpoint, err := getApiEndpointFromURL(reqURL)
	if err != nil {
		return "", err
	}

	type useRes struct {
		use      map[string]int64
		quotas   map[string]int64
		caps     map[string]int64
		capUsage map[string]int64
		err      error
	}
	useChan := make(chan useRes)
	go func() {
		use, quotas, caps, capUsage, err := v1.usageCache.getMonthlyUsageTotal(ctx, apiRec.UserID, service, endpoint)
		useChan <- useRes{
			use:      use,
			quotas:   quotas,
			err:      err,
			caps:     caps,
			capUsage: capUsage,
		}
	}()

	limitChan := make(chan error)
	go func() {
		tier, err := v1.tierCache.getTier(ctx, apiRec.UserID)
		if err != nil {
			log.Errorf("Error getting tier %s", err)
			limitChan <- err
		}
		limitChan <- v1.limiter.incr(apiRec.UserID, v1.config.RateLimits[tier])
	}()

	if apiRec.Status == keyStatusBlocked {
		return "", errBlocked(apiRec.StatusMessage)
	}

	scopeGood := false
	for _, s := range apiRec.Scopes {
		if s == "*" {
			// they can call anything they like
			scopeGood = true
			break
		}
		if strings.HasPrefix(reqURL, fmt.Sprintf("/v1/%s/", s)) {
			// match
			scopeGood = true
			break
		}
	}
	if !scopeGood {
		return "", errBlocked("Insufficient privileges")
	}

	if limitErr := <-limitChan; limitErr != nil {
		return "", errors.New("v1.blocked", "Too Many Requests", 429)
	}

	blockErr := errBlocked("Insufficient credit")
	price, err := v1.checkPrice(ctx, reqURL)
	if err != nil {
		return "", errBlocked(err.Error())
	}

	useObj := <-useChan
	if useObj.err != nil {
		log.Errorf("Failed to retrieve usage %s", useObj.err)
		// fail open
		return "free", nil
	}

	// usage name looks like "cache$Cache.Increment"
	usageName := fmt.Sprintf("%s$%s", service, endpoint)

	// have we used up our usage for this endpoint e.g. number of rows in the DB
	if u := useObj.caps[usageName]; u > 0 {
		if useObj.capUsage[usageName] >= u {
			return "", errBlocked("Usage cap exceeded")
		}
	}

	// have we used our free quota for this particular API?
	if price == 0 {
		// it's free!!
		// have we hit our fair use quota for the month?
		if useObj.use["totalfree"] < useObj.quotas["totalfree"] {
			return "free", nil
		}
		// start charging the unit price
		price = 1
	}

	count := useObj.use[usageName]
	quota := v1.publicapiCache.getQuota(service, endpoint)
	if count < quota {
		// still within free quota
		return "0", nil
	}

	balObj := <-balChan
	// no quota left, check balance to see if we can pay for this invocation
	if balObj.err != nil {
		log.Errorf("Failed to retrieve balance for customer %s %s", apiRec.UserID, balObj.err)
		// fail open
		return fmt.Sprintf("%d", price), nil
	}
	if balObj.bal >= price {
		return fmt.Sprintf("%d", price), nil
	}

	return "", blockErr

}

func errBlocked(msg string) error {
	return errors.Forbidden("v1.blocked", fmt.Sprintf("Request blocked. %s", msg))
}

func (v1 *V1) refreshToken(ctx context.Context, apiRec *apiKeyRecord, key string) error {
	// do we need to refresh the token?
	tok, _, err := new(jwt.Parser).ParseUnverified(apiRec.Token, jwt.MapClaims{})
	if err != nil {
		log.Errorf("Error parsing existing jwt %s", err)
		return errUnauthorized
	}
	if claims, ok := tok.Claims.(jwt.MapClaims); ok {
		if !claims.VerifyExpiresAt(time.Now().Unix(), true) {
			// needs a refresh
			tok, err := auth.Token(
				auth.WithCredentials(apiRec.AccID, key),
				auth.WithTokenIssuer(apiRec.Namespace),
				auth.WithExpiry(1*time.Hour))
			if err != nil {
				log.Errorf("Error refreshing token %s", err)
				return errInternal
			}
			apiRec.Token = tok.AccessToken
			if err := v1.writeAPIRecord(ctx, apiRec); err != nil {
				log.Errorf("Error updating API record %s", err)
				return errInternal
			}
		}
	} else {
		log.Errorf("Error parsing existing jwt claims %s", err)
		return errUnauthorized
	}
	return nil
}

func (v1 *V1) getRequestedService(reqURL string) (string, string, []*registry.Service, error) {
	service, endpoint, err := getApiEndpointFromURL(reqURL)
	if err != nil {
		return "", "", nil, err
	}
	svcs, err := registry.GetService(service)
	if err != nil {
		if err == registry.ErrNotFound {
			return "", "", nil, errors.NotFound("v1", "No such API")
		}
		log.Errorf("Error looking up service %s", err)
		return "", "", nil, errInternal
	}

	return service, endpoint, svcs, nil
}

// getAPIEndpointFromURL returns the api and endpoint name from a given URL.
// e.g. /v1/helloworld/call -> helloworld Helloworld.Call
func getApiEndpointFromURL(reqURL string) (string, string, error) {
	trimmedPath := strings.TrimPrefix(reqURL, "/v1/")
	parts := strings.Split(trimmedPath, "/")
	if len(parts) < 2 {
		// can't work out service and method
		return "", "", errors.NotFound("v1", "")
	}

	// lowercase the service name so /v1/Helloworld/Call is still valid
	service := strings.ToLower(parts[0])

	endpoint := ""
	if len(parts) == 2 {
		// /v1/helloworld/call -> helloworld Helloworld.Call
		endpoint = fmt.Sprintf("%s.%s", strings.Title(parts[0]), strings.Title(parts[1]))
	} else {
		// /v1/hello/world/call -> hello World.Call
		endpoint = fmt.Sprintf("%s.%s", strings.Title(parts[1]), strings.Title(parts[2]))
	}

	return service, endpoint, nil
}

func parseContentType(ct string) string {
	if idx := strings.IndexRune(ct, ';'); idx >= 0 {
		ct = ct[:idx]
	}
	if len(ct) == 0 {
		ct = "application/json"
	}
	return ct
}

// Endpoint is a catch all for endpoints
func (v1 *V1) Endpoint(ctx context.Context, stream server.Stream) error {
	// check api key
	defer stream.Close()

	md, ok := metadata.FromContext(ctx)
	if !ok {
		return errUnauthorized
	}

	authKey := md["Authorization"]
	if len(authKey) == 0 {
		authKey = md["Sec-Websocket-Protocol"]
		if len(authKey) == 0 {
			return errUnauthorized
		}
		authKey = "Bearer " + authKey
	}

	key, apiRec, err := v1.readAPIRecordByAPIKey(ctx, authKey)
	if err != nil {
		return err
	}

	reqURL, ok := md.Get("url")
	if !ok {
		log.Errorf("Requested URL not found")
		return errInternal
	}

	// reqURL likely contains the query params
	u, err := url.Parse(reqURL)
	if err == nil {
		// only set the path not the params
		reqURL = u.Path
	}

	price, err := v1.verifyCallAllowed(ctx, apiRec, reqURL)
	if err != nil {
		return err
	}

	if err := v1.refreshToken(ctx, apiRec, key); err != nil {
		return err
	}
	// set the auth
	ctx = metadata.Set(ctx, "Authorization", fmt.Sprintf("Bearer %s", apiRec.Token))

	// assume application/json for now
	ct := "application/json"
	service, endpoint, svcs, err := v1.getRequestedService(reqURL)
	if err != nil {
		return err
	}

	if isStream(endpoint, svcs) {
		return serveStream(ctx, stream, service, endpoint, svcs, apiRec, price)
	}

	// work out if this endpoint is api request
	isAPIReq := false
	for _, ep := range svcs[0].Endpoints {
		if strings.ToLower(ep.Name) == strings.ToLower(endpoint) {
			isAPIReq = ep.Metadata["handler"] == "api"
			break
		}
	}

	// forward the request
	var payload json.RawMessage
	if err := stream.Recv(&payload); err != nil {
		log.Errorf("Error receiving from stream %s", err)
		return errInternal
	}

	// because we have a query we want to merge params and payload
	if u != nil && len(u.RawQuery) > 0 {
		payload = mergeURLPayload(ctx, md, u, payload)
	}

	var payloadOut interface{}
	if isAPIReq {
		payloadOut, err = requestToProto(ctx, payload, "")
		if err != nil {
			log.Errorf("Error processing request %s", err)
			return errInternal
		}
	} else {
		payloadOut = payload
	}

	request := client.DefaultClient.NewRequest(
		service,
		endpoint,
		payloadOut,
		client.WithContentType(ct),
	)

	// specify the nodes
	var nodes []string
	for _, service := range svcs {
		for _, node := range service.Nodes {
			nodes = append(nodes, node.Address)
		}
	}

	// create request/response
	var response json.RawMessage
	// make the call
	if err := client.Call(ctx, request, &response, client.WithAddress(nodes...)); err != nil {

		if strings.Contains(err.Error(), "panic recovered: ") {
			// ping the alert service
			go func() {
				v1.alerts.ReportEvent(context.Background(), &alertpb.ReportEventRequest{
					Event: &alertpb.Event{
						Category: "panic",
						Action:   reqURL,
						Value:    1,
						Metadata: map[string]string{"error": err.Error()},
						UserID:   apiRec.UserID,
					}}, client.WithAuthToken())

			}()
			if strings.Contains(err.Error(), "not assignable") {
				// return something nicer, making massive assumption that panic was caused by badly formed request
				return errors.BadRequest("v1", "Request message malformed, please check and try again")
			}
			return errors.InternalServerError("v1", "Error processing request. If the problem persists please contact support")
		}
		return err
	}
	go publishEndpointEvent(reqURL, service, endpoint, apiRec, price)

	stream.Send(response)
	return nil

}

// mergePayload will attempt to generate a new payload including query params
func mergeURLPayload(ctx context.Context, md metadata.Metadata, u *url.URL, payload json.RawMessage) json.RawMessage {
	method, ok := md.Get("Method")
	if !ok {
		method = "POST"
	}
	// generate a new http request
	req, err := http.NewRequestWithContext(
		ctx,
		method,
		u.String(),
		bytes.NewReader(payload),
	)

	if err != nil {
		return payload
	}

	// attempt to parse out the params into the payload
	b, err := api.RequestPayload(req)
	if err != nil {
		return payload
	}

	return json.RawMessage(b)
}

func publishEndpointEvent(reqURL, apiName, endpointName string, apiRec *apiKeyRecord, price string) {
	if err := events.Publish(requests.Topic, requests.Event{
		Type: requests.EventType_EventTypeRequest,
		Request: &requests.Request{
			UserId:       apiRec.UserID,
			Namespace:    apiRec.Namespace,
			ApiKeyId:     apiRec.ID,
			Url:          reqURL,
			ApiName:      apiName,
			EndpointName: endpointName,
			Price:        price,
			ProjectId:    apiRec.UserID,
		}}); err != nil {
		log.Errorf("Error publishing event %s", err)
	}
}

func (v1 *V1) listAPIs() ([]string, error) {
	rsp, err := v1.publicapiCache.list()
	if err != nil {
		return nil, err
	}

	ret := make([]string, len(rsp))
	for i, v := range rsp {
		ret[i] = v.Name
	}
	return ret, nil
}

func (v1 *V1) DeleteCustomer(ctx context.Context, request *v1.DeleteCustomerRequest, response *v1.DeleteCustomerResponse) error {
	if _, err := m3oauth.VerifyMicroAdmin(ctx, "v1.DeleteCustomer"); err != nil {
		return err
	}

	if len(request.Id) == 0 {
		return errors.BadRequest("v1.DeleteCustomer", "Missing ID")
	}

	if err := v1.deleteCustomer(ctx, request.Id); err != nil {
		log.Errorf("Error deleting customer %s", err)
		return err
	}
	return nil
}

func (v1 *V1) deleteCustomer(ctx context.Context, userID string) error {
	// delete all their keys
	keys, err := listKeysForUser("micro", userID)
	if err != nil && err != store.ErrNotFound {
		return err
	}
	for _, k := range keys {
		if err := v1.deleteKey(ctx, k); err != nil {
			logger.Errorf("Error deleting key %s", err)
			return err
		}
	}
	return nil
}

func requestToProto(ctx context.Context, body []byte, reqURL string) (*pbapi.Request, error) {
	md, _ := metadata.FromContext(ctx)
	req := &pbapi.Request{
		Path:   reqURL,
		Method: md["Method"],
		Header: make(map[string]*pbapi.Pair),
		Get:    make(map[string]*pbapi.Pair),
		Post:   make(map[string]*pbapi.Pair),
		Url:    md["host"] + md["url"],
	}

	req.Body = string(body)

	for k, v := range md {
		req.Header[k] = &pbapi.Pair{
			Key:    k,
			Values: []string{v},
		}
	}

	return req, nil
}
