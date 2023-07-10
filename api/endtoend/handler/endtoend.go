package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
	"time"

	"m3o.dev/platform/service"
	balancepb "m3o.dev/api/balance/proto"

	"m3o.dev/platform/service/client"
	mconfig "m3o.dev/platform/service/config"
	merrors "m3o.dev/platform/service/errors"
	log "m3o.dev/platform/service/logger"
	mstore "m3o.dev/platform/service/store"
	alertpb "m3o.dev/api/alerts/proto"
	custpb "m3o.dev/api/customers/proto"
	endtoend "m3o.dev/api/endtoend/proto"
	pubpb "m3o.dev/api/publicapi/proto"
	onpb "m3o.dev/api/signup/proto"

	"github.com/google/uuid"
)

const (
	signupFrom     = "M3O <noreply@m3o.com>"
	signupSubject  = "Verify your M3O account email"
	keyOtp         = "otp"
	keyCheckResult = "checkResult"

	// how fresh does a check need to be? cron runs every 5 mins and check takes just over 1min.
	checkBuffer = 7 * time.Minute
)

type E2EResult struct {
	SetupErr    error
	SignupErr   error
	ExampleErrs []ExampleError
}

// platformOK returns true if signup and setup are successful and API examples *mostly* pass
func (e E2EResult) platformOK() bool {
	examplesFailed := false

	failedAPI := ""
	if len(e.ExampleErrs) > 0 {
		// has more than one API failed?
		for _, v := range e.ExampleErrs {
			if len(failedAPI) == 0 {
				failedAPI = v.API
				continue
			}
			if failedAPI != v.API {
				examplesFailed = true
			}
		}
	}
	return e.SetupErr == nil && e.SignupErr == nil && !examplesFailed
}

func (e E2EResult) examplesOK() bool {
	return len(e.ExampleErrs) == 0
}

func (e E2EResult) examplesErr() string {
	errs := make([]string, len(e.ExampleErrs))
	for i, v := range e.ExampleErrs {
		errs[i] = fmt.Sprintf("Error running example %s %s %s: %s", v.API, v.Endpoint, v.ExampleName, v.Value)
	}
	return strings.Join(errs, ". ")
}

type ExampleError struct {
	API         string
	Endpoint    string
	ExampleName string
	Value       error
}

var (
	otpRegexp = regexp.MustCompile("please copy and paste this verification code into the signup form:\\s*([a-zA-Z]*)\\s*This code expires")
)

func NewEndToEnd(srv *service.Service) *Endtoend {
	val, err := mconfig.Get("micro.endtoend.email")
	if err != nil {
		log.Fatalf("Cannot configure, error finding email: %s", err)
	}
	email := val.String("")
	if len(email) == 0 {
		log.Fatalf("Cannot configure, email not configured")
	}
	return &Endtoend{
		email:    email,
		custSvc:  custpb.NewCustomersService("customers", srv.Client()),
		alertSvc: alertpb.NewAlertsService("alerts", srv.Client()),
		balSvc:   balancepb.NewBalanceService("balance", srv.Client()),
		pubSvc:   pubpb.NewPublicapiService("publicapi", srv.Client()),
	}
}

func (e *Endtoend) Mailin(ctx context.Context, req *json.RawMessage, rsp *MailinResponse) error {
	log.Infof("Received Endtoend.Mailin request %d", len(*req))
	var inbound mailinMessage

	if err := json.Unmarshal(*req, &inbound); err != nil {
		log.Errorf("Error unmarshalling request %s", err)
		// returning err would make the email bounce
		return nil
	}
	// TODO make this configurable
	if !strings.Contains(inbound.Headers["to"].(string), e.email) ||
		!strings.Contains(inbound.Headers["from"].(string), signupFrom) ||
		!strings.Contains(inbound.Headers["subject"].(string), signupSubject) {
		// skip
		log.Debugf("Skipping inbound %+v", inbound)
		return nil
	}

	tok := otpRegexp.FindStringSubmatch(inbound.Plain)
	if len(tok) != 2 {
		log.Errorf("Couldn't find token in email body: %s", inbound.Plain)
		// returning err would make the email bounce
		return nil
	}
	otp := otp{
		Token: tok[1],
		Time:  time.Now().Unix(),
	}
	b, err := json.Marshal(otp)
	if err != nil {
		log.Errorf("Failed to marshal otp %s", err)
		// returning err would make the email bounce
		return nil
	}
	if err := mstore.Write(&mstore.Record{
		Key:   keyOtp,
		Value: b,
	}); err != nil {
		log.Errorf("Error storing OTP %s", err)
		return nil
	}
	return nil
}

func (e *Endtoend) Check(ctx context.Context, request *endtoend.Request, response *endtoend.Response) error {
	log.Info("Received Endtoend.Check request")
	recs, err := mstore.Read(keyCheckResult)
	if err != nil {
		return merrors.InternalServerError("endtoend.check.store", "Failed to load last result %s", err)
	}
	if len(recs) == 0 {
		return merrors.InternalServerError("endtoend.check.noresults", "Failed to load last result, no results found")
	}
	cr := checkResult{}
	if err := json.Unmarshal(recs[0].Value, &cr); err != nil {
		return merrors.InternalServerError("endtoend.check.unmarshal", "Failed to unmarshal last result %s", err)
	}
	if cr.Passed && time.Now().Add(-checkBuffer).Unix() < cr.Time {
		response.StatusCode = 200
		return nil
	}
	response.StatusCode = 500
	response.Body = cr.Error
	if len(response.Body) == 0 {
		response.Body = "No recent successful check"
	}
	return merrors.New("endtoend.chack.failed", response.Body, response.StatusCode)

}

func (e *Endtoend) RunCheck(ctx context.Context, request *endtoend.Request, response *endtoend.Response) error {
	go e.runCheck()
	return nil
}

func (e *Endtoend) CronCheck() {
	e.runCheck()
}

func (e *Endtoend) runCheck() error {
	start := time.Now()
	res := e.signupAndRunExamples()

	// record the result
	result := checkResult{
		Time:   time.Now().Unix(),
		Passed: res.platformOK(),
	}

	if !result.Passed {
		if res.SetupErr != nil {
			result.Error = res.SetupErr.Error()
		} else if res.SignupErr != nil {
			result.Error = res.SignupErr.Error()
		} else {
			result.Error = res.examplesErr()
		}
	}
	cr, err := e.checkSite()
	if err != nil {
		result.Error = err.Error()
	} else if len(cr.errs) > 0 {
		result.Error = cr.err()
		result.Passed = false
	}

	b, _ := json.Marshal(result)

	mstore.Write(&mstore.Record{
		Key:   keyCheckResult,
		Value: b,
	})
	log.Infof("Signup check took %s to complete", time.Now().Sub(start))

	if !res.platformOK() || !res.examplesOK() {
		// alert if required
		action := "signup"
		errString := result.Error
		if res.platformOK() && !res.examplesOK() {
			action = "examples"
			if len(errString) == 0 {
				errString = res.examplesErr()
			}
		}
		e.alertSvc.ReportEvent(context.Background(), &alertpb.ReportEventRequest{
			Event: &alertpb.Event{
				Category: "monitoring",
				Action:   action,
				Label:    "endtoend",
				Value:    1,
				Metadata: map[string]string{"error": errString},
			},
		}, client.WithAuthToken())
	}
	if !cr.ok {
		e.alertSvc.ReportEvent(context.Background(), &alertpb.ReportEventRequest{
			Event: &alertpb.Event{
				Category: "monitoring",
				Action:   "website",
				Label:    "endtoend",
				Value:    1,
				Metadata: map[string]string{"error": cr.err()},
			},
		}, client.WithAuthToken())
	}

	return nil
}

func (e *Endtoend) signupAndRunExamples() E2EResult {
	e2eRes := E2EResult{}
	// reset, delete any existing customers. Try this a few times, we sometimes get timeout
	var delErr error
	for i := 0; i < 3; i++ {
		_, err := e.custSvc.Delete(context.TODO(), &custpb.DeleteRequest{Email: e.email, Force: true}, client.WithAuthToken(), client.WithRequestTimeout(15*time.Second))
		if err == nil {
			delErr = nil
			break
		}
		merr, ok := err.(*merrors.Error)
		if ok && (merr.Code == 404 || strings.Contains(merr.Detail, "not found")) {
			delErr = nil
			break
		}
		delErr = fmt.Errorf("error while cleaning up existing customer %s", err)
	}
	if delErr != nil {
		e2eRes.SetupErr = delErr
		return e2eRes
	}

	start := time.Now()
	rsp, err := http.Post("https://api.m3o.com/signup/User",
		"application/json",
		strings.NewReader(fmt.Sprintf(`{"email":"%s"}`, e.email)))
	if err != nil {
		e2eRes.SignupErr = fmt.Errorf("error requesting verification email %s", err)
		return e2eRes
	}
	defer rsp.Body.Close()
	if rsp.StatusCode != 200 {
		b, _ := ioutil.ReadAll(rsp.Body)
		e2eRes.SignupErr = fmt.Errorf("error requesting verification email %s %s", rsp.Status, string(b))
		return e2eRes
	}

	code := ""

	loopStart := time.Now()
	for time.Now().Sub(loopStart) < 2*time.Minute {
		time.Sleep(10 * time.Second)
		log.Infof("Checking for otp")
		recs, err := mstore.Read(keyOtp)
		if err != nil {
			log.Errorf("Error reading otp from store %s", err)
			continue
		}
		if len(recs) == 0 {
			log.Infof("No recs found")
			continue
		}
		otp := otp{}
		if err := json.Unmarshal(recs[0].Value, &otp); err != nil {
			log.Errorf("Error unmarshalling otp from store %s", err)
			continue
		}
		if otp.Time < start.Unix() {
			log.Infof("Otp is old")
			// old token
			continue
		}
		log.Infof("Found otp")
		code = otp.Token
		break
	}
	if len(code) == 0 {
		e2eRes.SignupErr = fmt.Errorf("no OTP code received by email")
		return e2eRes
	}
	rsp, err = http.Post("https://api.m3o.com/signup/Verify",
		"application/json",
		strings.NewReader(fmt.Sprintf(`{"email":"%s", "token":"%s", "secret":"%s"}`, e.email, code, uuid.New().String())))

	if err != nil {
		e2eRes.SignupErr = fmt.Errorf("error completing signup %s", err)
		return e2eRes
	}
	defer rsp.Body.Close()
	b, _ := ioutil.ReadAll(rsp.Body)
	if rsp.StatusCode != 200 {
		e2eRes.SignupErr = fmt.Errorf("error completing signup %s %s", rsp.Status, string(b))
		return e2eRes
	}
	var srsp onpb.VerifyResponse
	json.Unmarshal(b, &srsp)

	var custErr error
	loopStart = time.Now()
	for time.Now().Sub(loopStart) < 2*time.Minute {
		time.Sleep(10 * time.Second)
		rsp, err := e.custSvc.Read(context.TODO(), &custpb.ReadRequest{Email: e.email}, client.WithAuthToken())
		if err != nil {
			custErr = fmt.Errorf("error checking customer status %s", err)
			continue
		}
		if rsp.Customer.Status != "verified" {
			custErr = fmt.Errorf("customer status should be verified but is %s", rsp.Customer.Status)
			continue
		}
		custErr = nil
		break
	}

	if custErr != nil {
		e2eRes.SignupErr = custErr
		return e2eRes
	}

	// generate a key
	req, err := http.NewRequest("POST", "https://api.m3o.com/v1/api/keys/generate", strings.NewReader(`{"description":"test key", "scopes": ["*"]}`))
	if err != nil {
		e2eRes.SetupErr = fmt.Errorf("error generating key request %s", err)
		return e2eRes
	}
	req.Header.Set("Authorization", "Bearer "+srsp.AuthToken.AccessToken)
	req.Header.Set("Content-Type", "application/json")
	rsp, err = http.DefaultClient.Do(req)
	if err != nil {
		e2eRes.SetupErr = fmt.Errorf("error generating key %s", err)
		return e2eRes
	}
	defer rsp.Body.Close()
	b, _ = ioutil.ReadAll(rsp.Body)
	if rsp.StatusCode != 200 {
		e2eRes.SetupErr = fmt.Errorf("error generating key %s %s", rsp.Status, string(b))
		return e2eRes
	}
	keyRsp := struct {
		ApiKey string `json:"api_key"`
	}{}
	if err := json.Unmarshal(b, &keyRsp); err != nil {
		e2eRes.SetupErr = fmt.Errorf("error generating key, failed to unmarshal response %s", err)
		return e2eRes
	}

	// Cheat, need to add money
	if _, err := e.balSvc.Increment(context.Background(), &balancepb.IncrementRequest{
		CustomerId: srsp.CustomerID,
		Delta:      1000000,
		Visible:    false,
		Reference:  "E2E top up",
	}, client.WithAuthToken()); err != nil {
		e2eRes.SetupErr = fmt.Errorf("error adding to balance, %s", err)
		return e2eRes
	}

	// run some apis
	pubrsp, err := e.pubSvc.List(context.Background(), &pubpb.ListRequest{}, client.WithAuthToken())
	if err != nil {
		e2eRes.SetupErr = fmt.Errorf("error listing apis %s", err)
		return e2eRes
	}

	exampleErrs := []ExampleError{}
	for _, api := range pubrsp.Apis {
		var examples apiExamples
		if len(api.ExamplesJson) == 0 {
			log.Infof("No examples, skipping %s", api.Name)
			continue
		}

		keys, err := objectKeys(api.ExamplesJson)
		if err != nil {
			log.Errorf("Failed to find keys for %s %s", api.Name, err)
			exampleErrs = append(exampleErrs, ExampleError{
				API:   api.Name,
				Value: fmt.Errorf("Failed to find keys for %s %s", api.Name, err),
			})
			continue
		}
		if err := json.Unmarshal([]byte(api.ExamplesJson), &examples); err != nil {
			log.Errorf("Failed to unmarshal examples for %s %s", api.Name, err)
			exampleErrs = append(exampleErrs, ExampleError{
				API:   api.Name,
				Value: fmt.Errorf("Failed to unmarshal examples for %s %s", api.Name, err),
			})
			continue
		}

		// process the examples in json order to respect implicit dependencies
		for _, endpointName := range keys {
			exs := examples[endpointName]
			for _, ex := range exs {
				if !ex.RunCheck {
					log.Infof("Skipping %s %s %s", api.Name, endpointName, ex.Title)
					// skip
					continue
				}
				time.Sleep(100 * time.Millisecond) // free tier request limit
				b, err := json.Marshal(ex.Request)
				if err != nil {
					log.Errorf("Failed to marshal example request for %s %s %s %s", api.Name, endpointName, ex.Title, err)
					exampleErrs = append(exampleErrs, ExampleError{
						API:         api.Name,
						Endpoint:    endpointName,
						ExampleName: ex.Title,
						Value:       fmt.Errorf("Failed to marshal example request %s", err),
					})
					continue
				}

				req, err := http.NewRequest("POST", fmt.Sprintf("https://api.m3o.com/v1/%s/%s", api.Name, endpointName), bytes.NewReader(b))
				if err != nil {
					log.Errorf("Error generating example request %s %s %s %s", api.Name, endpointName, ex.Title, err)
					exampleErrs = append(exampleErrs, ExampleError{
						API:         api.Name,
						Endpoint:    endpointName,
						ExampleName: ex.Title,
						Value:       fmt.Errorf("Error generating example request %s", err),
					})
					continue
				}
				req.Header.Set("Authorization", "Bearer "+keyRsp.ApiKey)
				req.Header.Set("Content-Type", "application/json")
				rsp, err = http.DefaultClient.Do(req)
				if err != nil {
					log.Errorf("Error running example %s %s %s %s", api.Name, endpointName, ex.Title, err)
					exampleErrs = append(exampleErrs, ExampleError{
						API:         api.Name,
						Endpoint:    endpointName,
						ExampleName: ex.Title,
						Value:       fmt.Errorf("Error running example %s", err),
					})
					continue
				}
				defer rsp.Body.Close()
				b, _ = ioutil.ReadAll(rsp.Body)
				if rsp.StatusCode != 200 {
					log.Errorf("Error running example %s %s %s %s %s", api.Name, endpointName, ex.Title, rsp.Status, string(b))
					exampleErrs = append(exampleErrs, ExampleError{
						API:         api.Name,
						Endpoint:    endpointName,
						ExampleName: ex.Title,
						Value:       fmt.Errorf("Error running example %s %s", rsp.Status, string(b)),
					})
					continue
				}
				log.Infof("API response for example %s %s %s %s %s", api.Name, endpointName, ex.Title, rsp.Status, string(b))
				// TODO test response against expected response with fuzzy matching

			}
		}
	}
	// TODO add credit via stripe
	if len(exampleErrs) > 0 {
		e2eRes.ExampleErrs = exampleErrs
	}
	return e2eRes
}

func objectKeys(s string) ([]string, error) {
	d := json.NewDecoder(strings.NewReader(s))
	t, err := d.Token()
	if err != nil {
		return nil, err
	}
	if t != json.Delim('{') {
		return nil, errors.New("expected start of object")
	}
	var keys []string
	for {
		t, err := d.Token()
		if err != nil {
			return nil, err
		}
		if t == json.Delim('}') {
			return keys, nil
		}
		keys = append(keys, t.(string))
		if err := skipValue(d); err != nil {
			return nil, err
		}
	}
}
func skipValue(d *json.Decoder) error {
	t, err := d.Token()
	if err != nil {
		return err
	}
	switch t {
	case json.Delim('['), json.Delim('{'):
		for {
			if err := skipValue(d); err != nil {
				if err == end {
					break
				}
				return err
			}
		}
	case json.Delim(']'), json.Delim('}'):
		return end
	}
	return nil
}

var end = errors.New("invalid end of array or object")

type websiteError struct {
	url string
	err string
}

type websiteCheck struct {
	ok   bool
	errs []*websiteError
}

func (e *Endtoend) checkSite() (*websiteCheck, error) {
	// run some apis
	pubrsp, err := e.pubSvc.List(context.Background(), &pubpb.ListRequest{}, client.WithAuthToken())
	if err != nil {
		return nil, err
	}
	ret := &websiteCheck{
		ok:   false,
		errs: []*websiteError{},
	}
	if len(pubrsp.Apis) == 0 {
		ret.errs = append(ret.errs, &websiteError{
			url: "https://m3o.com/explore",
			err: "No apis returned on site",
		})
	}
	urls := []string{"https://m3o.com/%s", "https://m3o.com/%s/api", "https://m3o.com/%s/console"}
	for _, api := range pubrsp.Apis {
		for _, url := range urls {
			checkurl := fmt.Sprintf(url, api.Name)
			rsp, err := http.Get(checkurl)
			if err != nil {
				log.Errorf("Error retrieving url %s", checkurl)
				ret.errs = append(ret.errs, &websiteError{
					url: checkurl,
					err: err.Error(),
				})
				continue
			}
			defer rsp.Body.Close()
			if rsp.StatusCode != 200 {
				log.Errorf("Error retrieving url %s %s", checkurl, rsp.Status)
				ret.errs = append(ret.errs, &websiteError{
					url: checkurl,
					err: rsp.Status,
				})
				continue
			}
		}
	}
	ret.ok = len(ret.errs) == 0
	return ret, nil
}

func (w *websiteCheck) err() string {
	errs := make([]string, len(w.errs))
	for i, v := range w.errs {
		errs[i] = fmt.Sprintf("Error checking url %s: %s", v.url, v.err)
	}
	return strings.Join(errs, ". ")
}
