package handler

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	mevents "m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	pevents "m3o.dev/api/pkg/events"
	eventspb "m3o.dev/api/pkg/events/proto/customers"
	requestspb "m3o.dev/api/pkg/events/proto/requests"
)

func (v1 *V1) consumeEvents() {
	go pevents.ProcessTopic(eventspb.Topic, "v1api", v1.processCustomerEvents)
	go pevents.ProcessTopic(requestspb.Topic, "v1api", v1.processRequestEvents)
}

func (v1 *V1) processCustomerEvents(ev mevents.Event) error {
	ctx := context.Background()
	ce := &eventspb.Event{}
	if err := json.Unmarshal(ev.Payload, ce); err != nil {
		logger.Errorf("Error unmarshalling customer event: $s", err)
		return nil
	}
	switch ce.Type {
	case eventspb.EventType_EventTypeDeleted:
		if err := v1.processCustomerDelete(ctx, ce); err != nil {
			logger.Errorf("Error processing customer delete event %s", err)
			return err
		}
	case eventspb.EventType_EventTypeBanned:
		if err := v1.processCustomerBan(ctx, ce); err != nil {
			logger.Errorf("Error processing customer banned event %s", err)
			return err
		}
	case eventspb.EventType_EventTypeUnbanned:
		if err := v1.processCustomerUnban(ctx, ce); err != nil {
			logger.Errorf("Error processing customer unbanned event %s", err)
			return err
		}
	default:
		logger.Infof("Skipping event %+v", ce)
	}
	return nil

}

func (v1 *V1) processCustomerDelete(ctx context.Context, event *eventspb.Event) error {
	// TODO PROJECTS probably replace with a project delete event processing
	return v1.deleteCustomer(ctx, event.Customer.Id)
}

func (v1 *V1) processCustomerBan(ctx context.Context, event *eventspb.Event) error {
	// TODO PROJECTS disable all the keys on all the projects
	// disable all their keys
	return v1.updateKeyStatus(ctx, "v1.ban", "micro", event.Customer.Id, "", keyStatusBlocked, "User has been banned")
}

func (v1 *V1) processCustomerUnban(ctx context.Context, event *eventspb.Event) error {
	// TODO PROJECTS enable all keys on all the projects
	return v1.updateKeyStatus(ctx, "v1.unban", "micro", event.Customer.Id, "", keyStatusActive, "")
}

func (v1 *V1) processRequestEvents(ev mevents.Event) error {
	ctx := context.Background()
	ce := &requestspb.Event{}
	if err := json.Unmarshal(ev.Payload, ce); err != nil {
		logger.Errorf("Error unmarshalling request event: $s", err)
		return nil
	}
	switch ce.Type {
	case requestspb.EventType_EventTypeRequest:
		if err := v1.processRequestEvent(ctx, ce, ev.Timestamp); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	default:
	}
	return nil
}

func (v1 *V1) processRequestEvent(ctx context.Context, event *requestspb.Event, evTime time.Time) error {
	req := event.Request
	rec, err := readAPIRecordByKeyID(req.Namespace, req.UserId, req.ApiKeyId)
	if err != nil {
		logger.Errorf("Error retrieving key %s", err)
		if strings.Contains(err.Error(), "not found") {
			logger.Warnf("Skipping unknown key %v", event)
			return nil
		}
		return err
	}
	if rec.LastSeen > evTime.Unix() {
		// skip
		return nil
	}
	rec.LastSeen = evTime.Unix()
	return v1.writeAPIRecord(ctx, rec)
}
