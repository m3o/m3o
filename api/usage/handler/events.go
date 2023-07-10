package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	mevents "m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	pevents "m3o.dev/api/pkg/events"
	eventspb "m3o.dev/api/pkg/events/proto/customers"
	"m3o.dev/api/pkg/events/proto/requests"
)

const (
	totalID = "total"
)

func (p *UsageSvc) consumeEvents() {
	go pevents.ProcessTopic(requests.Topic, "usage", p.processV1apiEvents)
	go pevents.ProcessTopic(eventspb.Topic, "usage", p.processCustomerEvents)
}

func (p *UsageSvc) processV1apiEvents(ev mevents.Event) error {
	ctx := context.Background()
	ve := &requests.Event{}
	if err := json.Unmarshal(ev.Payload, ve); err != nil {
		logger.Errorf("Error unmarshalling v1 event: $s", err)
		return nil
	}
	switch ve.Type {
	case requests.EventType_EventTypeRequest:
		if err := p.processRequest(ctx, ve.Request, ev.Timestamp); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	default:
		logger.Infof("Unrecognised event %+v", ve)
	}
	return nil

}

func (p *UsageSvc) processRequest(ctx context.Context, event *requests.Request, t time.Time) error {
	// TODO PROJECTS switch to being project aware
	_, err := p.c.incr(ctx, event.UserId, event.ApiName, 1, t)
	p.c.incr(ctx, event.UserId, fmt.Sprintf("%s$%s", event.ApiName, event.EndpointName), 1, t)
	// monthly totals power monthly quotas
	p.c.incrMonthly(ctx, event.UserId, fmt.Sprintf("%s$%s", event.ApiName, event.EndpointName), 1, t)
	if event.Price == "free" {
		// totalFree is the total of all calls to free endpoints (i.e. not paid). Powers a monthly usage cap
		p.c.incrMonthly(ctx, event.UserId, totalFree, 1, t)
	}
	p.c.incrMonthly(ctx, event.UserId, "total", 1, t)
	// incr total counts for the API and individual endpoint
	p.c.incr(ctx, totalID, event.ApiName, 1, t)
	p.c.incr(ctx, totalID, fmt.Sprintf("%s$%s", event.ApiName, event.EndpointName), 1, t)
	return err
}

func (p *UsageSvc) processCustomerEvents(ev mevents.Event) error {
	ctx := context.Background()
	ce := &eventspb.Event{}
	if err := json.Unmarshal(ev.Payload, ce); err != nil {
		logger.Errorf("Error unmarshalling customer event: $s", err)
		return nil
	}
	switch ce.Type {
	case eventspb.EventType_EventTypeDeleted:
		if err := p.processCustomerDelete(ctx, ce); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	case eventspb.EventType_EventTypeSubscriptionChanged:
		if err := p.processSubscriptionChanged(ctx, ce); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	default:
		logger.Infof("Skipping event %+v", ce)
	}
	return nil

}

func (p *UsageSvc) processCustomerDelete(ctx context.Context, event *eventspb.Event) error {
	// delete all their usage
	return p.deleteUser(ctx, event.Customer.Id)
}

func (p *UsageSvc) processSubscriptionChanged(ctx context.Context, event *eventspb.Event) error {
	// adjust their quota according to their subscription tier
	return p.switchTier(event.Customer.Id, event.SubscriptionChanged.Tier)
}
