package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
	"time"

	githubapi "github.com/google/go-github/v38/github"
	"github.com/google/uuid"
	authproto "m3o.dev/platform/proto/auth"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/client"
	mevents "m3o.dev/platform/service/events"
	"github.com/patrickmn/go-cache"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
	cproto "m3o.dev/api/customers/proto"
	eproto "m3o.dev/api/emails/proto"
	oauth "m3o.dev/api/oauth/proto"
	eventspb "m3o.dev/api/pkg/events/proto/customers"

	mconfig "m3o.dev/platform/service/config"
	cont "m3o.dev/platform/service/context"
	merrors "m3o.dev/platform/service/errors"
	logger "m3o.dev/platform/service/logger"
	model "m3o.dev/platform/service/model"
)

var (
	oauthConfGl = &oauth2.Config{
		ClientID:     "",
		ClientSecret: "",
		RedirectURL:  "http://127.0.0.1:4200/google-login",
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
	oauthConfGlTest = &oauth2.Config{
		ClientID:     "",
		ClientSecret: "",
		RedirectURL:  "http://127.0.0.1:4200/google-login",
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
	oauthStateStringGl = ""

	oauthConfGithub = &oauth2.Config{
		ClientID:     "",
		ClientSecret: "",
		RedirectURL:  "http://127.0.0.1:4200/github-login",
		Scopes:       []string{"user:email"},
		Endpoint:     github.Endpoint,
	}
	oauthConfGithubTest = &oauth2.Config{
		ClientID:     "",
		ClientSecret: "",
		RedirectURL:  "http://127.0.0.1:4200/github-login",
		Scopes:       []string{"user:email"},
		Endpoint:     github.Endpoint,
	}
)

const (
	microNamespace   = "micro"
	internalErrorMsg = "An error occurred during onboarding. Contact #general at https://m3o.chat/ if the issue persists"
)

type googleConf struct {
	ClientID         string `json:"client_id"`
	TestClientID     string `json:"test_client_id"`
	ClientSecret     string `json:"client_secret"`
	TestClientSecret string `json:"test_client_secret"`
	RedirectURL      string `json:"redirect_url"`
	TestRedirectURL  string `json:"test_redirect_url"`
}

type githubConf struct {
	ClientID         string `json:"client_id"`
	TestClientID     string `json:"test_client_id"`
	ClientSecret     string `json:"client_secret"`
	TestClientSecret string `json:"test_client_secret"`
	RedirectURL      string `json:"redirect_url"`
	TestRedirectURL  string `json:"test_redirect_url"`
}

type oauthConf struct {
	Google googleConf `json:"google"`
	Github githubConf `json:"github"`
}

type Oauth struct {
	customerService cproto.CustomersService
	emailService    eproto.EmailsService
	auth            auth.Auth
	accounts        authproto.AccountsService
	config          oauthConf
	cache           *cache.Cache
	resetCode       model.Model
	track           model.Model
}

func NewOauth(srv *service.Service, auth auth.Auth) *Oauth {
	c := oauthConf{}
	val, err := mconfig.Get("micro.oauth")
	if err != nil {
		logger.Fatalf("Error getting config: %v", err)
	}
	err = val.Scan(&c)
	if err != nil {
		logger.Fatalf("Error scanning config: %v", err)
	}

	if c.Google.ClientSecret == "" {
		logger.Fatal("No google oauth client ID")
	}
	if c.Google.ClientSecret == "" {
		logger.Fatal("No google oauth client secret")
	}
	oauthConfGl.ClientID = c.Google.ClientID
	oauthConfGl.ClientSecret = c.Google.ClientSecret
	if c.Google.RedirectURL != "" {
		oauthConfGl.RedirectURL = c.Google.RedirectURL
	}

	oauthConfGlTest.ClientID = c.Google.TestClientID
	oauthConfGlTest.ClientSecret = c.Google.TestClientSecret
	if c.Google.TestRedirectURL != "" {
		oauthConfGlTest.RedirectURL = c.Google.TestRedirectURL
	}

	if c.Github.ClientSecret == "" {
		logger.Fatal("No google oauth client ID")
	}
	if c.Github.ClientSecret == "" {
		logger.Fatal("No google oauth client secret")
	}
	oauthConfGithub.ClientID = c.Github.ClientID
	oauthConfGithub.ClientSecret = c.Github.ClientSecret
	if c.Github.RedirectURL != "" {
		oauthConfGithub.RedirectURL = c.Github.RedirectURL
	}

	oauthConfGithubTest.ClientID = c.Github.TestClientID
	oauthConfGithubTest.ClientSecret = c.Github.TestClientSecret
	if c.Github.TestRedirectURL != "" {
		oauthConfGithubTest.RedirectURL = c.Github.TestRedirectURL
	}

	s := &Oauth{
		customerService: cproto.NewCustomersService("customers", srv.Client()),
		auth:            auth,
		accounts:        authproto.NewAccountsService("auth", srv.Client()),
		config:          c,
		cache:           cache.New(1*time.Minute, 5*time.Minute),
	}
	return s
}

// GoogleOauthURL returns the url which kicks off the google oauth flow
func (e *Oauth) GoogleURL(ctx context.Context, req *oauth.GoogleURLRequest, rsp *oauth.GoogleURLResponse) error {
	conf := oauthConfGl
	if req.Test {
		conf = oauthConfGlTest
	}

	URL, err := url.Parse(conf.Endpoint.AuthURL)
	if err != nil {
		return err
	}

	parameters := url.Values{}
	parameters.Add("client_id", conf.ClientID)
	parameters.Add("scope", strings.Join(conf.Scopes, " "))
	parameters.Add("redirect_uri", conf.RedirectURL)
	parameters.Add("response_type", "code")
	//parameters.Add("state", oauthStateString)
	URL.RawQuery = parameters.Encode()
	logger.Info(URL.String())
	url := URL.String()
	rsp.Url = url
	return nil
}

func (e *Oauth) GoogleLogin(ctx context.Context, req *oauth.GoogleLoginRequest, rsp *oauth.LoginResponse) error {
	conf := oauthConfGl
	if req.Test {
		conf = oauthConfGlTest
	}

	state := req.State
	if state != oauthStateStringGl {
		return fmt.Errorf("invalid oauth state, expected " + oauthStateStringGl + ", got " + state + "\n")
	}

	code := req.Code

	if code == "" {
		reason := req.ErrorReason
		if reason == "user_denied" {
			return fmt.Errorf("user has denied permission")
		}
		return fmt.Errorf("code not found")
	}

	token, err := conf.Exchange(oauth2.NoContext, code)
	if err != nil {
		return fmt.Errorf("failed exchange: %v", err)
	}

	logger.Info("Got token")
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + url.QueryEscape(token.AccessToken))
	if err != nil {
		return fmt.Errorf("Get: " + err.Error() + "\n")
	}
	defer resp.Body.Close()

	response, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	// TODO there must be a proper lib api for this
	gresp := map[string]interface{}{}
	err = json.Unmarshal(response, &gresp)
	if err != nil {
		return err
	}

	email, emailOk := gresp["email"].(string)
	if !emailOk {
		return fmt.Errorf("no email in oauth info")
	}

	readResp, err := e.customerService.Read(cont.DefaultContext, &cproto.ReadRequest{
		Email: email,
	}, client.WithAuthToken())
	if err != nil && (strings.Contains(err.Error(), "notfound") || strings.Contains(err.Error(), "not found")) {
		logger.Infof("Oauth registering %v", email)
		rsp.IsSignup = true
		return e.registerOauthUser(ctx, rsp, email, "google")
	}
	if err != nil {
		return err
	}
	logger.Infof("Oauth logging in %v", email)
	return e.loginOauthUser(ctx, rsp, readResp.Customer.Id, email, "google")
}

func (e *Oauth) GithubURL(ctx context.Context, req *oauth.GithubURLRequest, rsp *oauth.GithubURLResponse) error {
	conf := oauthConfGithub
	if req.Test {
		conf = oauthConfGithubTest
	}

	URL, err := url.Parse(conf.Endpoint.AuthURL)
	if err != nil {
		return err
	}

	parameters := url.Values{}
	parameters.Add("client_id", conf.ClientID)
	parameters.Add("scope", strings.Join(conf.Scopes, " "))
	parameters.Add("redirect_uri", conf.RedirectURL)
	parameters.Add("response_type", "code")
	//parameters.Add("state", oauthStateString)
	URL.RawQuery = parameters.Encode()
	logger.Info(URL.String())
	url := URL.String()
	rsp.Url = url
	return nil
}

func (e *Oauth) GithubLogin(ctx context.Context, req *oauth.GithubLoginRequest, rsp *oauth.LoginResponse) error {
	conf := oauthConfGithub
	if req.Test {
		conf = oauthConfGithubTest
	}

	state := req.State
	if state != oauthStateStringGl {
		return fmt.Errorf("invalid oauth state, expected " + oauthStateStringGl + ", got " + state + "\n")
	}

	code := req.Code

	if code == "" {
		reason := req.ErrorReason
		if reason == "user_denied" {
			return fmt.Errorf("user has denied permission")
		}
		return fmt.Errorf("code not found")
	}

	token, err := conf.Exchange(oauth2.NoContext, code)
	if err != nil {
		return fmt.Errorf("failed exchange: %v", err)
	}

	logger.Info("Got token", token)

	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token.AccessToken},
	)
	tc := oauth2.NewClient(ctx, ts)
	githubClient := githubapi.NewClient(tc)
	emails, _, err := githubClient.Users.ListEmails(ctx, nil)
	if err != nil {
		return err
	}
	email := ""
	for _, em := range emails {
		if em.Primary != nil && *em.Primary {
			email = *em.Email
		}
	}
	if email == "" {
		return fmt.Errorf("no github primary email found")
	}

	readResp, err := e.customerService.Read(ctx, &cproto.ReadRequest{
		Email: email,
	}, client.WithAuthToken())
	if err != nil && (strings.Contains(err.Error(), "notfound") || strings.Contains(err.Error(), "not found")) {
		logger.Infof("Oauth registering %v", email)
		rsp.IsSignup = true
		return e.registerOauthUser(ctx, rsp, email, "github")
	}
	if err != nil {
		return err
	}
	logger.Infof("Oauth logging in %v", email)
	return e.loginOauthUser(ctx, rsp, readResp.Customer.Id, email, "github")
}

func (e *Oauth) registerOauthUser(ctx context.Context, rsp *oauth.LoginResponse, email, provider string) error {
	// create entry in customers service
	crsp, err := e.customerService.Create(ctx, &cproto.CreateRequest{Email: email}, client.WithAuthToken())
	if err != nil {
		logger.Error(err)
		return merrors.InternalServerError("oauth.registerOauthUser", internalErrorMsg)
	}

	if _, err := e.customerService.MarkVerified(ctx, &cproto.MarkVerifiedRequest{Email: email}, client.WithAuthToken()); err != nil {
		logger.Errorf("Error marking customer as verified: %v", err)
		return merrors.InternalServerError("oauth.registerOauthUser", internalErrorMsg)
	}

	secret := uuid.New().String()
	_, err = e.auth.Generate(crsp.Customer.Id,
		auth.WithScopes("customer"),
		auth.WithSecret(secret),
		auth.WithIssuer(microNamespace),
		auth.WithName(email),
		auth.WithType("customer"))
	if err != nil {
		logger.Errorf("Error generating token for %v: %v", crsp.Customer.Id, err)
		return merrors.InternalServerError("oauth.registerOauthUser", internalErrorMsg)
	}

	t, err := e.auth.Token(auth.WithCredentials(crsp.Customer.Id, secret), auth.WithTokenIssuer(microNamespace))
	if err != nil {
		logger.Errorf("Can't get token for %v: %v", crsp.Customer.Id, err)
		return merrors.InternalServerError("oauth.registerOauthUser", internalErrorMsg)
	}
	rsp.AuthToken = &oauth.AuthToken{
		AccessToken:  t.AccessToken,
		RefreshToken: t.RefreshToken,
		Expiry:       t.Expiry.Unix(),
		Created:      t.Created.Unix(),
	}
	rsp.CustomerID = crsp.Customer.Id
	rsp.Namespace = microNamespace
	if err := mevents.Publish(eventspb.Topic, &eventspb.Event{
		Type:     eventspb.EventType_EventTypeSignup,
		Customer: objToEvent(crsp.Customer),
		Signup:   &eventspb.Signup{Method: provider},
	}); err != nil {
		logger.Warnf("Error publishing %s", err)
	}
	return nil
}

func objToEvent(cust *cproto.Customer) *eventspb.Customer {
	return &eventspb.Customer{
		Id:      cust.Id,
		Status:  cust.Status,
		Created: cust.Created,
		Email:   cust.Email,
		Updated: cust.Updated,
	}
}

func (e *Oauth) loginOauthUser(ctx context.Context, rsp *oauth.LoginResponse, id, email, provider string) error {
	secret := uuid.New().String()
	_, err := e.accounts.ChangeSecret(ctx, &authproto.ChangeSecretRequest{
		Id:        email,
		NewSecret: secret,
		Options: &authproto.Options{
			Namespace: microNamespace,
		},
	}, client.WithAuthToken())
	if err != nil {
		return err
	}

	t, err := e.auth.Token(auth.WithCredentials(id, secret), auth.WithTokenIssuer(microNamespace))
	if err != nil {
		logger.Errorf("Can't get token for %v: %v", id, err)
		return merrors.InternalServerError("oauth.loginOauthUser", internalErrorMsg)
	}
	rsp.AuthToken = &oauth.AuthToken{
		AccessToken:  t.AccessToken,
		RefreshToken: t.RefreshToken,
		Expiry:       t.Expiry.Unix(),
		Created:      t.Created.Unix(),
	}
	rsp.CustomerID = id
	rsp.Namespace = microNamespace

	go func() {
		crsp, err := e.customerService.Read(ctx, &cproto.ReadRequest{
			Id: id,
		}, client.WithAuthToken())
		var cust *cproto.Customer
		if err != nil {
			logger.Errorf("Error looking up customer")
			cust = &cproto.Customer{Id: id}
		} else {
			cust = crsp.Customer
		}
		if err := mevents.Publish(eventspb.Topic, &eventspb.Event{
			Type:     eventspb.EventType_EventTypeLogin,
			Customer: objToEvent(cust),
			Login:    &eventspb.Login{Method: provider},
		}); err != nil {
			logger.Warnf("Error publishing %s", err)
		}
	}()

	return nil
}
