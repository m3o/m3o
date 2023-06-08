package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/kevinburke/twilio-go"
	"github.com/micro/micro/v3/service/auth"
	"github.com/micro/micro/v3/service/config"
	"github.com/micro/micro/v3/service/errors"
	"github.com/micro/micro/v3/service/logger"
	"github.com/micro/micro/v3/service/store"
	"github.com/micro/services/pkg/tenant"
	pb "m3o.dev/api/twilio/proto"
)

const (
	prefixUserID   = "byUserID"
	prefixTwilioID = "byTwilioID"
)

type Sent struct {
	UserID      string
	TwilioMsgID string
	Timestamp   time.Time
}

type Twilio struct{}

func (e *Twilio) SendSms(ctx context.Context, req *pb.SendSmsRequest, rsp *pb.SendSmsResponse) error {
	if len(req.From) == 0 {
		return errors.BadRequest("twilio.sendsms", "require from field")
	}
	if len(req.To) == 0 {
		return errors.BadRequest("twilio.sendsms", "require to field")
	}
	reg, _ := regexp.Compile("^\\+[0-9]+$")
	if !reg.MatchString(req.To) {
		return errors.BadRequest("twilio.sendsms", "invalid to field format")
	}
	if len(req.Message) == 0 {
		return errors.BadRequest("twilio.sendsms", "message is blank")
	}

	tnt, _ := tenant.FromContext(ctx)
	// crudely ban any sender in the banned list aka no impersonating
	frm := strings.ToLower(req.From)
	for _, sender := range BanFrom {
		if strings.Contains(frm, strings.ToLower(sender)) {
			acc, _ := auth.AccountFromContext(ctx)

			logger.Error("Request to send from %v blocked by account: %v tenant: %v", req.From, acc, tnt)
			return errors.BadRequest("twilio.sendsms", "sender blocked")
		}
	}

	v, err := config.Get("twilio.sid")
	if err != nil {
		logger.Error("Failed to get twilio.sid config")
		return errors.InternalServerError("twilio.sendsms", "failed to send message")
	}
	sid := v.String("")

	v, err = config.Get("twilio.token")
	if err != nil {
		logger.Error("Failed to get twilio.token config")
		return errors.InternalServerError("twilio.sendsms", "failed to send message")
	}
	token := v.String("")

	v, err = config.Get("twilio.number")
	if err != nil {
		logger.Error("Failed to get twilio.number config")
		return errors.InternalServerError("twilio.sendsms", "failed to send message")
	}
	number := v.String("")

	message := req.Message + "  Sent from " + req.From

	if len(message) > 160 {
		return errors.BadRequest("twilio.sendsms", "message is too long")
	}

	vals := url.Values{}
	vals.Set("Body", message)
	vals.Set("From", number)
	vals.Set("To", req.To)
	// non configurable and must match publicapi.json
	vals.Set("MaxPrice", "0.01")

	client := twilio.NewClient(sid, token, nil)
	twMsg, err := client.Messages.Create(ctx, vals)
	if err != nil {
		logger.Errorf("Failed to send message: %v", err)
		return errors.InternalServerError("twilio.sendsms", "failed to send message: %v", err.Error())
	}

	sent := Sent{
		UserID:      tnt,
		TwilioMsgID: twMsg.Sid,
		Timestamp:   time.Now(),
	}

	b, _ := json.Marshal(&sent)
	// log the association so we can correlate who sent what
	if err := store.Write(&store.Record{
		Key:   fmt.Sprintf("%s/%s/%s/%s", prefixUserID, sent.UserID, time.Now().Format("20060102"), sent.TwilioMsgID),
		Value: b,
	}); err != nil {
		logger.Errorf("Failed to store association %+v %s", sent, err)
	}
	if err := store.Write(&store.Record{
		Key:   fmt.Sprintf("%s/%s", prefixTwilioID, sent.TwilioMsgID),
		Value: b,
	}); err != nil {
		logger.Errorf("Failed to store association %+v %s", sent, err)
	}

	rsp.Status = "ok"

	return nil
}
