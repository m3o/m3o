package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/logger"
	cpb "m3o.dev/api/customers/proto"
	pb "m3o.dev/api/mixpanel/proto"
)

type Mixpanel struct {
	client     *MixpanelClient
	ignoreList []string
	custSvc    cpb.CustomersService
}

type conf struct {
	User       string
	Secret     string
	Project    string
	IgnoreList string
}

func NewHandler(svc *service.Service) *Mixpanel {
	c, err := config.Get("micro.mixpanel")
	if err != nil {
		logger.Fatalf("Failed to load config %s", err)
	}
	var cObj conf
	if err := c.Scan(&cObj); err != nil {
		logger.Fatalf("Failed to load config %s", err)
	}
	m := &Mixpanel{
		client: &MixpanelClient{
			User:    cObj.User,
			Pass:    cObj.Secret,
			Project: cObj.Project,
		},
		ignoreList: strings.Split(cObj.IgnoreList, ","),
		custSvc:    cpb.NewCustomersService("customers", svc.Client()),
	}
	go m.consumeEvents()
	return m
}

type Event struct {
	Event string `json:"event"`
	// distinct_id property tracks a user
	// token property maps your mixpanel project
	// time property is unix timestamp in secs
	// $insert_id is the UUID of the event
	Properties map[string]interface{} `json:"properties"`
}

type MixpanelClient struct {
	User    string
	Pass    string
	Project string
}

func (m *MixpanelClient) newMixpanelEvent(topic, typeStr, customerID, evtID string, ts int64, data interface{}) Event {
	mev := Event{
		Event: fmt.Sprintf("%s_%s", topic, typeStr),
		Properties: map[string]interface{}{
			"token":       m.Project,
			"time":        ts,
			"distinct_id": customerID,
			"$insert_id":  evtID,
			"data":        data,
		},
	}
	return mev
}

func (m *MixpanelClient) Track(ev Event) error {
	b, err := json.Marshal(ev)
	if err != nil {
		return err
	}
	logger.Infof("Tracking %s", string(b))
	data := url.Values{
		"data": {string(b)},
	}
	req, err := http.NewRequest(http.MethodPost, "https://api.mixpanel.com/track#live-event-deduplicate", strings.NewReader(data.Encode()))
	if err != nil {
		logger.Errorf("Error creating http req %s", err)
		return err
	}
	req.SetBasicAuth(m.User, m.Pass)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	rsp, err := http.DefaultClient.Do(req)
	if err != nil {
		logger.Errorf("Error creating http req %s", err)
		return err
	}
	defer rsp.Body.Close()
	if rsp.StatusCode > 299 || rsp.StatusCode < 200 {
		logger.Errorf("Error creating http req %s", err)
		return err
	}
	b, err = ioutil.ReadAll(rsp.Body)
	if err != nil {
		logger.Errorf("Error reading http rsp %s %s", err, string(b))
		return nil // ignore
	}
	logger.Infof("Response %s", string(b))
	return nil
}

func (b *Mixpanel) Ping(ctx context.Context, request *pb.PingRequest, response *pb.PingResponse) error {
	return nil
}
