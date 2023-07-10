package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"

	"m3o.dev/platform/service/config"
	log "m3o.dev/platform/service/logger"
	mstore "m3o.dev/platform/service/store"
	alerts "m3o.dev/api/alerts/proto"

	"github.com/google/uuid"
	"github.com/slack-go/slack"
)

const (
	storePrefixEvents = "events/"
)

type Alerts struct {
	slackClient *slack.Client
	config      conf
}

type event struct {
	ID       string            `json:"id"`
	UserID   string            `json:"userID"`
	Category string            `json:"category"`
	Action   string            `json:"action"`
	Label    string            `json:"label"`
	Value    uint64            `json:"value"`
	Metadata map[string]string `json:"metadata"`
}

type slackConf struct {
	Token    string `json:"token"`
	Enabled  bool   `json:"enabled"`
	Channel  string `json:"channel"`
	Username string `json:"user_name"`
}

type discordConf struct {
	Enabled bool   `json:"enabled"`
	Webhook string `json:"webhook""`
}

type conf struct {
	Slack        slackConf   `json:"slack"`
	GaPropertyID string      `json:"ga_property_id"`
	BlockList    []string    `json:"blocklist"`
	Discord      discordConf `json:"discord"`
}

func New() *Alerts {
	c := conf{}
	val, err := config.Get("micro.alert")
	if err != nil {
		log.Warnf("Error getting config: %v", err)
	}
	err = val.Scan(&c)
	if err != nil {
		log.Warnf("Error scanning config: %v", err)
	}
	if c.Slack.Enabled && len(c.Slack.Token) == 0 {
		log.Errorf("Slack token missing")
	}
	if len(c.GaPropertyID) == 0 {
		log.Errorf("Google Analytics key (property ID) is missing")
	}
	log.Infof("Slack enabled: %v", c.Slack.Enabled)
	if len(c.Slack.Channel) == 0 {
		c.Slack.Channel = "alerts"
	}
	if len(c.Slack.Username) == 0 {
		c.Slack.Username = "Alerts Service"
	}
	log.Infof("Discord enabled: %v", c.Discord.Enabled)

	return &Alerts{
		slackClient: slack.New(c.Slack.Token),
		config:      c,
	}
}

// ReportEvent ingests events and sends alerts if needed
func (e *Alerts) ReportEvent(ctx context.Context, req *alerts.ReportEventRequest, rsp *alerts.ReportEventResponse) error {
	if req.Event == nil {
		return errors.New("event can't be empty")
	}
	ev := &event{
		ID:       uuid.New().String(),
		Category: req.Event.Category,
		Action:   req.Event.Action,
		Label:    req.Event.Label,
		Value:    req.Event.Value,
		UserID:   req.Event.UserID,
	}
	for _, block := range e.config.BlockList {
		// skip anything in the block list
		if strings.Contains(ev.Label, block) {
			return nil
		}
	}
	// ignoring the error intentionally here so we still sends alerts
	// even if persistence is failing
	err := e.saveEvent(ev)
	if err != nil {
		log.Warnf("Error saving event: %v", err)
	}
	err = e.sendToGA(ev)
	if err != nil {
		log.Warnf("Error sending event to google analytics: %v", err)
	}
	if req.Event.Action == "success" {
		// don't care about success actions right now
		return nil
	}
	jsond, err := json.MarshalIndent(req.Event, "", "   ")
	if err != nil {
		return err
	}
	msg := fmt.Sprintf("Event received:\n```\n%v\n```", string(jsond))

	if e.config.Slack.Enabled {
		_, _, _, err = e.slackClient.SendMessage(e.config.Slack.Channel, slack.MsgOptionUsername(e.config.Slack.Username), slack.MsgOptionText(msg, false))
		if err != nil {
			log.Errorf("Error sending to Slack %s", err)
			return err
		}
	}
	if e.config.Discord.Enabled {

		discordMsg := map[string]interface{}{"content": msg}
		b, _ := json.Marshal(discordMsg)
		rsp, err := http.Post(e.config.Discord.Webhook, "application/json", bytes.NewBuffer(b))
		if err != nil {
			log.Errorf("Error sending to Discord %s", err)
			return err
		}
		defer rsp.Body.Close()
		if rsp.StatusCode > 299 {
			b, _ := ioutil.ReadAll(rsp.Body)
			log.Errorf("Error sending to Discord %v %s", rsp.StatusCode, string(b))
		}

	}
	return nil
}

func (e *Alerts) sendToGA(td *event) error {
	if e.config.GaPropertyID == "" {
		return errors.New("analytics: GA_TRACKING_ID environment variable is missing")
	}
	if td.Category == "" || td.Action == "" {
		return errors.New("analytics: category and action are required")
	}

	cid := td.UserID
	if len(cid) == 0 {
		// GA does not seem to accept events without user id so we generate a UUID
		cid = uuid.New().String()
	}
	v := url.Values{
		"v":   {"1"},
		"tid": {e.config.GaPropertyID},
		// Anonymously identifies a particular user. See the parameter guide for
		// details:
		// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cid
		//
		// Depending on your application, this might want to be associated with the
		// user in a cookie.
		"cid": {cid},
		"t":   {"event"},
		"ec":  {td.Category},
		"ea":  {td.Action},
		"ua":  {"cli"},
	}

	if td.Label != "" {
		v.Set("el", td.Label)
	}

	v.Set("ev", fmt.Sprintf("%d", td.Value))

	// NOTE: Google Analytics returns a 200, even if the request is malformed.
	_, err := http.PostForm("https://www.google-analytics.com/collect", v)
	return err
}

func (e *Alerts) saveEvent(ev *event) error {
	bytes, err := json.Marshal(ev)
	if err != nil {
		return err
	}

	return mstore.Write(&mstore.Record{
		Key:   storePrefixEvents + ev.ID,
		Value: bytes})
}
