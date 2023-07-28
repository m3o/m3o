package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"net/mail"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	mevents "m3o.dev/platform/service/events"
	"github.com/patrickmn/go-cache"
	eventspb "m3o.dev/api/pkg/events/proto/customers"

	authproto "m3o.dev/platform/proto/auth"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/client"
	mconfig "m3o.dev/platform/service/config"
	cont "m3o.dev/platform/service/context"
	merrors "m3o.dev/platform/service/errors"
	logger "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	cproto "m3o.dev/api/customers/proto"
	eproto "m3o.dev/api/emails/proto"
	signup "m3o.dev/api/signup/proto"
)

const (
	microNamespace   = "micro"
	internalErrorMsg = "An error occurred during signup. Email support@m3o.com if the issue persists"
)

const (
	expiryDuration  = 5 * time.Minute
	prefixTrackByID = "signup.TrackRequest:eqByIdUnordById"
	prefixResetCode = "signup:reset-code"
	prefixWaitlist  = "signup:waitlist"
)

type tokenToEmail struct {
	Email      string `json:"email"`
	Token      string `json:"token"`
	Created    int64  `json:"created"`
	CustomerID string `json:"customerID"`
}

type Signup struct {
	customerService cproto.CustomersService
	emailService    eproto.EmailsService
	auth            auth.Auth
	accounts        authproto.AccountsService
	config          conf
	cache           *cache.Cache
}

type ResetToken struct {
	Created int64
	ID      string
	Token   string
}

type Waitlist struct {
	Created int64
	Email   string
}

type sendgridConf struct {
	TemplateID         string `json:"template_id"`
	RecoveryTemplateID string `json:"recovery_template_id"`
	WelcomeTemplateID  string `json:"welcome_template_id"`
}

type conf struct {
	Sendgrid            sendgridConf `json:"sendgrid"`
	AllowList           []string     `json:"allow_list"`
	BlockList           []string     `json:"block_list"`            // block ANY emails being sent to these emails
	EngagementBlockList []string     `json:"engagement_block_list"` // allow sign up emails but block engagement emails like welcome etc
	WelcomeDelay        string       `json:"welcome_delay"`         // delay between creation of customer and sending welcome email (time duration e.g. 24h)
	PromoCredit         int64        `json:"promoCredit"`
	PromoMessage        string       `json:"promoMessage"`
}

func NewSignup(srv *service.Service, auth auth.Auth) *Signup {
	c := conf{}
	val, err := mconfig.Get("micro.signup")
	if err != nil {
		logger.Fatalf("Error getting config: %v", err)
	}
	err = val.Scan(&c)
	if err != nil {
		logger.Fatalf("Error scanning config: %v", err)
	}
	if len(c.Sendgrid.TemplateID) == 0 {
		logger.Fatalf("No sendgrid template ID provided")
	}

	s := &Signup{
		customerService: cproto.NewCustomersService("customers", srv.Client()),
		emailService:    eproto.NewEmailsService("emails", srv.Client()),
		auth:            auth,
		accounts:        authproto.NewAccountsService("auth", srv.Client()),
		config:          c,
		cache:           cache.New(1*time.Minute, 5*time.Minute),
	}
	return s
}

// taken from https://stackoverflow.com/questions/22892120/how-to-generate-a-random-string-of-a-fixed-length-in-go
const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const (
	letterIdxBits = 6                    // 6 bits to represent a letter index
	letterIdxMask = 1<<letterIdxBits - 1 // All 1-bits, as many as letterIdxBits
	letterIdxMax  = 63 / letterIdxBits   // # of letter indices fitting in 63 bits
)

var src = rand.NewSource(time.Now().UnixNano())

func randStringBytesMaskImprSrc(n int) string {
	b := make([]byte, n)
	// A src.Int63() generates 63 random bits, enough for letterIdxMax characters!
	for i, cache, remain := n-1, src.Int63(), letterIdxMax; i >= 0; {
		if remain == 0 {
			cache, remain = src.Int63(), letterIdxMax
		}
		if idx := int(cache & letterIdxMask); idx < len(letterBytes) {
			b[i] = letterBytes[idx]
			i--
		}
		cache >>= letterIdxBits
		remain--
	}

	return string(b)
}

// User is the first step in the signup flow.User
// A stripe customer and a verification token will be created and an email sent.
func (e *Signup) User(ctx context.Context, req *signup.UserRequest, rsp *signup.UserResponse) error {
	logger.Info("Received Signup.User request")

	// check block list and allow list
	if len(e.config.BlockList) > 0 {
		for _, email := range e.config.BlockList {
			re, err := regexp.Compile(email)
			if err != nil {
				logger.Warnf("Failed to compile block list regexp %s", email)
				continue
			}
			if re.MatchString(req.Email) {
				logger.Infof("Blocking email from signup %s", req.Email)
				return merrors.InternalServerError("signup.User", "Error sending verification email for user")
			}
		}
	}

	if len(e.config.AllowList) > 0 {
		// only allow these to signup
		allowed := false
		for _, email := range e.config.AllowList {
			re, err := regexp.Compile(email)
			if err != nil {
				logger.Warnf("Failed to compile allow list regexp %s", email)
				continue
			}
			if re.MatchString(req.Email) {
				allowed = true
				break
			}
		}
		if !allowed {
			logger.Infof("Blocking email from signup %s", req.Email)
			return merrors.InternalServerError("signup.User", "Error sending verification email for user")
		}
	}

	// create entry in customers service
	crsp, err := e.customerService.Create(ctx, &cproto.CreateRequest{Email: req.Email}, client.WithAuthToken())
	if err != nil {
		logger.Error(err)
		return merrors.InternalServerError("signup.User", internalErrorMsg)
	}

	k := randStringBytesMaskImprSrc(8)
	tok := &tokenToEmail{
		Token:      k,
		Email:      req.Email,
		Created:    time.Now().Unix(),
		CustomerID: crsp.Customer.Id,
	}

	bytes, err := json.Marshal(tok)
	if err != nil {
		logger.Error(err)
		return merrors.InternalServerError("signup.User", internalErrorMsg)
	}

	if err := store.Write(&store.Record{
		Key:   req.Email,
		Value: bytes,
	}); err != nil {
		logger.Error(err)
		return merrors.InternalServerError("signup.User", internalErrorMsg)
	}

	// Send email
	// @todo send different emails based on if the account already exists
	// ie. registration vs login email.
	err = e.sendEmail(ctx, req.Email, e.config.Sendgrid.TemplateID, map[string]interface{}{
		"token": k,
	})
	if err != nil {
		logger.Errorf("Error when sending email to %v: %v", req.Email, err)
		return merrors.InternalServerError("signup.User", internalErrorMsg)
	}

	return nil
}

func (e *Signup) sendEmail(ctx context.Context, email, templateID string, templateData map[string]interface{}) error {
	b, _ := json.Marshal(templateData)
	_, err := e.emailService.Send(ctx, &eproto.SendRequest{To: email, TemplateId: templateID, TemplateData: b}, client.WithAuthToken())
	return err
}

func (e *Signup) Verify(ctx context.Context, req *signup.VerifyRequest, rsp *signup.VerifyResponse) error {
	logger.Info("Received Signup.Verify request")

	recs, err := store.Read(req.Email)
	if err == store.ErrNotFound {
		logger.Errorf("Can't verify record for %v: record not found", req.Email)
		return merrors.InternalServerError("signup.Verify", internalErrorMsg)
	} else if err != nil {
		logger.Errorf("Error reading store: err")
		return merrors.InternalServerError("signup.Verify", internalErrorMsg)
	}

	tok := &tokenToEmail{}
	if err := json.Unmarshal(recs[0].Value, tok); err != nil {
		logger.Errorf("Error when unmarshaling stored token object for %v: %v", req.Email, err)
		return merrors.InternalServerError("signup.Verify", internalErrorMsg)
	}
	if tok.Token != req.Token {
		return merrors.Forbidden("signup.Verify", "The token you provided is invalid")
	}

	if time.Since(time.Unix(tok.Created, 0)) > expiryDuration {
		return merrors.Forbidden("signup.Verify", "The token you provided has expired")
	}

	rsp.CustomerID = tok.CustomerID
	if _, err := e.customerService.MarkVerified(ctx, &cproto.MarkVerifiedRequest{Email: tok.Email}, client.WithAuthToken()); err != nil {
		logger.Errorf("Error marking customer as verified: %v", err)
		return merrors.InternalServerError("signup.Verify", internalErrorMsg)
	}

	// take secret from the request
	secret := req.Secret

	// generate a random secret
	if len(req.Secret) == 0 {
		secret = uuid.New().String()
	}
	_, err = e.auth.Generate(tok.CustomerID,
		auth.WithScopes("customer"),
		auth.WithSecret(secret),
		auth.WithIssuer(microNamespace),
		auth.WithName(req.Email),
		auth.WithType("customer"))
	if err != nil {
		logger.Errorf("Error generating token for %v: %v", tok.CustomerID, err)
		return merrors.InternalServerError("signup.Verify", internalErrorMsg)
	}

	t, err := e.auth.Token(auth.WithCredentials(tok.CustomerID, secret), auth.WithTokenIssuer(microNamespace))
	if err != nil {
		logger.Errorf("Can't get token for %v: %v", tok.CustomerID, err)
		return merrors.InternalServerError("signup.Verify", internalErrorMsg)
	}
	rsp.AuthToken = &signup.AuthToken{
		AccessToken:  t.AccessToken,
		RefreshToken: t.RefreshToken,
		Expiry:       t.Expiry.Unix(),
		Created:      t.Created.Unix(),
	}
	rsp.CustomerID = tok.CustomerID
	rsp.Namespace = microNamespace

	if err := mevents.Publish(eventspb.Topic, &eventspb.Event{
		Type:     eventspb.EventType_EventTypeSignup,
		Customer: &eventspb.Customer{Id: tok.CustomerID},
		Signup:   &eventspb.Signup{Method: "email"},
	}); err != nil {
		logger.Warnf("Error publishing %s", err)
	}

	return nil
}

func (e *Signup) Recover(ctx context.Context, req *signup.RecoverRequest, rsp *signup.RecoverResponse) error {
	logger.Info("Received Signup.Recover request")
	_, found := e.cache.Get(req.Email)
	if found {
		return merrors.BadRequest("signup.recover", "We have issued a recovery email recently. Please check that.")
	}

	// is this even a user?
	crsp, err := e.customerService.Read(ctx, &cproto.ReadRequest{Email: req.Email}, client.WithAuthToken())
	if err != nil {
		if merr, ok := err.(*merrors.Error); ok && (merr.Code == 404 || strings.Contains(merr.Detail, "not found")) {
			// security, don't report back to user but don't send an email
			return nil
		}
		logger.Errorf("Error sending recovery email")
		return merrors.InternalServerError("signup.recover", "Error while trying to send recovery email, please try again later")
	}

	token := uuid.New().String()
	created := time.Now().Unix()

	rec := store.NewRecord(
		fmt.Sprintf("%s:%s", prefixResetCode, req.Email),
		&ResetToken{
			ID:      req.Email,
			Token:   token,
			Created: created,
		},
	)
	// write reset code
	err = store.Write(rec)
	if err != nil {
		return merrors.InternalServerError("signup.recover", err.Error())
	}

	logger.Infof("Sending recovery code %v to email %v", token, req.Email)
	err = e.sendEmail(ctx, req.Email, e.config.Sendgrid.RecoveryTemplateID, map[string]interface{}{
		"token": token,
	})
	if err != nil {
		return merrors.InternalServerError("signup.recover", err.Error())
	}
	if err == nil {
		e.cache.Set(req.Email, true, cache.DefaultExpiration)
	}

	if err := mevents.Publish(eventspb.Topic, &eventspb.Event{
		Type: eventspb.EventType_EventTypePasswordReset,
		Customer: &eventspb.Customer{
			Id:      crsp.Customer.Id,
			Email:   crsp.Customer.Email,
			Status:  crsp.Customer.Status,
			Created: crsp.Customer.Created,
			Updated: crsp.Customer.Updated,
		},
		PasswordReset: &eventspb.PasswordReset{},
	}); err != nil {
		logger.Warnf("Error publishing %s", err)
	}

	return err
}

func (e *Signup) ResetPassword(ctx context.Context, req *signup.ResetPasswordRequest, rsp *signup.ResetPasswordResponse) error {
	m := new(ResetToken)
	if req.Email == "" {
		return errors.New("Email is required")
	}

	key := fmt.Sprintf("%s:%s", prefixResetCode, req.Email)
	recs, err := store.Read(key, store.ReadLimit(1))
	if err != nil {
		return err
	}
	if len(recs) == 0 {
		return errors.New("token not found")
	}
	// decode the token
	recs[0].Decode(&m)

	if m.ID == "" {
		return errors.New("can't find token")
	}
	if m.Token == "" {
		return errors.New("can't find token")
	}
	if m.Created == 0 {
		return errors.New("expiry can't be calculated")
	}
	if m.Token != req.Token {
		return errors.New("tokens don't match")
	}
	if time.Unix(m.Created, 0).Before(time.Now().Add(-1 * 10 * time.Minute)) {
		return errors.New("token expired")
	}

	_, err = e.accounts.ChangeSecret(cont.DefaultContext, &authproto.ChangeSecretRequest{
		Id:        req.Email,
		NewSecret: req.Password,
		Options: &authproto.Options{
			Namespace: microNamespace,
		},
	}, client.WithAuthToken())
	if err != nil {
		return err
	}

	// delete the token
	return store.Delete(key)
}

func (e *Signup) Track(ctx context.Context,
	req *signup.TrackRequest,
	rsp *signup.TrackResponse) error {
	if req.Id == "" {
		return merrors.BadRequest("signup.track", "Missing ID param")
	}
	oldTrack := signup.TrackRequest{}
	// CRUFT : not a typo, req.Id is repeated to be compatible with the old implementation
	key := fmt.Sprintf("%s:%s:%s", prefixTrackByID, req.Id, req.Id)
	recs, err := store.Read(key)
	if err != nil && err != store.ErrNotFound {
		logger.Errorf("Error looking up id %s", err)
		return merrors.InternalServerError("signup.track", "Error processing request")
	}
	if len(recs) > 0 {
		if err := json.Unmarshal(recs[0].Value, &oldTrack); err != nil {
			logger.Errorf("Error marshalling %s", err)
			return merrors.InternalServerError("signup.track", "Error processing request")
		}
	}

	// support partial update
	if req.GetFirstVisit() == 0 {
		req.FirstVisit = oldTrack.FirstVisit
	}
	if req.GetFirstVerification() == 0 {
		req.FirstVerification = oldTrack.FirstVerification
	}
	if req.Referrer == "" {
		req.Referrer = oldTrack.Referrer
	}
	if req.Registration == 0 {
		req.Registration = oldTrack.Registration
	}
	if req.Email == "" {
		req.Email = oldTrack.Email
	}

	b, err := json.Marshal(req)
	if err != nil {
		logger.Errorf("Error marshalling %s", err)
		return merrors.InternalServerError("signup.track", "Error processing request")
	}

	if err := store.Write(&store.Record{Key: key, Value: b}); err != nil {
		logger.Errorf("Error writing update %s", err)
		return merrors.InternalServerError("signup.track", "Error processing request")
	}

	return nil
}

func (s *Signup) Waitlist(ctx context.Context, req *signup.WaitlistRequest, rsp *signup.WaitlistResponse) error {
	if len(req.Email) == 0 {
		return merrors.BadRequest("signup.waitlist", "missing email")
	}

	// check email validity
	_, err := mail.ParseAddress(req.Email)
	if err != nil {
		return merrors.BadRequest("signup.waitlist", err.Error())
	}

	// store the user record
	rec := store.NewRecord(
		prefixWaitlist+":"+req.Email,
		&Waitlist{Created: time.Now().Unix(), Email: req.Email},
	)

	// store user in waitlist
	return store.Write(rec)
}
