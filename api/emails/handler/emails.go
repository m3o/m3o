package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	mauth "github.com/micro/micro/v3/service/auth"
	"github.com/micro/micro/v3/service/config"
	"github.com/micro/micro/v3/service/errors"
	log "github.com/micro/micro/v3/service/logger"
	emails "m3o.dev/api/emails/proto"
)

const (
	defaultIssuer = "micro"
)

type sendgridConf struct {
	ApiKey string `json:"api_key"`
}

type conf struct {
	SendingEnabled bool         `json:"enabled"`
	DefaultFrom    string       `json:"email_from"`
	Sendgrid       sendgridConf `json:"sendgrid"`
	PoolName       string       `json:"ip_pool_name"`
}

func NewEmailsHandler() *Emails {
	c := conf{}
	val, err := config.Get("micro.emails")
	if err != nil {
		log.Warnf("Error getting config: %v", err)
	}
	err = val.Scan(&c)
	if err != nil {
		log.Warnf("Error scanning config: %v", err)
	}
	if c.SendingEnabled && len(c.Sendgrid.ApiKey) == 0 {
		log.Fatalf("Sendgrid API key not configured")
	}
	return &Emails{
		c,
	}
}

type Emails struct {
	config conf
}

func (e *Emails) Send(ctx context.Context, request *emails.SendRequest, response *emails.SendResponse) error {
	acc, ok := mauth.AccountFromContext(ctx)
	if !ok || acc.Issuer != defaultIssuer { // currently only for m3o internal use
		return errors.Unauthorized("emails.send.unauthorized", "Not authorized")
	}
	if len(request.TemplateId) == 0 {
		return errors.BadRequest("emails.send.validation", "Missing template ID")
	}
	if len(request.To) == 0 {
		return errors.BadRequest("emails.send.validation", "Missing to address")
	}

	templateData := map[string]interface{}{}
	if len(request.TemplateData) > 0 {
		if err := json.Unmarshal(request.TemplateData, &templateData); err != nil {
			log.Errorf("Error unmarshalling template data %s %s", string(request.TemplateData), err)
			return errors.BadRequest("emails.send.templatedata", "Unable to unmarshal template data")
		}
	}
	if err := e.sendEmail(request.From, request.To, request.TemplateId, request.SendAt, templateData); err != nil {
		log.Errorf("Failed to send email: %v", err)
		return errors.InternalServerError("emails.sendemail", "Error sending email")
	}
	return nil
}

// sendEmail sends an email invite via the sendgrid API using the
// pre-designed email template. Docs: https://bit.ly/2VYPQD1
func (e *Emails) sendEmail(from, to, templateID string, sendAt int64, templateData map[string]interface{}) error {
	if !e.config.SendingEnabled {
		masked := to
		if len(to) > 4 {
			masked = masked[:4] + strings.Repeat("*", len(masked[4:]))
		} else {
			masked = strings.Repeat("*", len(masked))
		}
		log.Infof("Sending disabled. Skipping send to %s, template ID %s", masked, templateID)
		return nil
	}
	emailFrom := from
	if len(emailFrom) == 0 {
		emailFrom = e.config.DefaultFrom // TODO only works while this is an internal M3O service
	}

	reqMap := map[string]interface{}{
		"template_id": templateID,
		"from": map[string]string{
			"email": emailFrom,
		},
		"personalizations": []interface{}{
			map[string]interface{}{
				"to": []map[string]string{
					{
						"email": to,
					},
				},
				"dynamic_template_data": templateData,
			},
		},
		"mail_settings": map[string]interface{}{
			"sandbox_mode": map[string]bool{
				"enable": !e.config.SendingEnabled,
			},
		},
	}
	if len(e.config.PoolName) > 0 {
		reqMap["ip_pool_name"] = e.config.PoolName
	}
	if sendAt > 0 {
		reqMap["send_at"] = sendAt
	}

	reqBody, _ := json.Marshal(reqMap)
	log.Infof("Sending email to %v with template %v data %v\n", to, templateID, templateData)

	req, err := http.NewRequest("POST", "https://api.sendgrid.com/v3/mail/send", bytes.NewBuffer(reqBody))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+e.config.Sendgrid.ApiKey)
	req.Header.Set("Content-Type", "application/json")
	rsp, err := new(http.Client).Do(req)
	if err != nil {
		return fmt.Errorf("could not send email, error: %v", err)
	}
	defer rsp.Body.Close()

	if rsp.StatusCode < 200 || rsp.StatusCode > 299 {
		bytes, err := ioutil.ReadAll(rsp.Body)
		if err != nil {
			return err
		}
		return fmt.Errorf("could not send email, error: %v", string(bytes))
	}
	return nil
}
