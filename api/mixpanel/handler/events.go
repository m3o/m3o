package handler

import (
	"context"
	"encoding/json"
	"fmt"

	"m3o.dev/platform/service/client"
	merrors "m3o.dev/platform/service/errors"
	mevents "m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	customers "m3o.dev/api/customers/proto"
	"m3o.dev/api/pkg/events"
	customerspb "m3o.dev/api/pkg/events/proto/customers"
	"m3o.dev/api/pkg/events/proto/requests"
)

func (b *Mixpanel) consumeEvents() {
	go events.ProcessTopic(requests.Topic, "mixpanel", b.processV1APIEvent)
	go events.ProcessTopic(customerspb.Topic, "mixpanel", b.processCustomerEvent)
}

func (b *Mixpanel) processV1APIEvent(ev mevents.Event) error {
	ve := &requests.Event{}

	if err := json.Unmarshal(ev.Payload, ve); err != nil {
		logger.Errorf("Error unmarshalling v1 event, discarding: $s", err)
		return nil
	}

	customerID := ""
	switch ve.Type {
	case requests.EventType_EventTypeRequest:
		customerID = ve.Request.UserId
	default:
		logger.Infof("Event type for v1 not supported %s", ve.Type)
		return nil
	}

	ignore, err := b.ignoreCustomer(customerID)
	if ignore {
		return nil
	}
	if err != nil {
		return err
	}

	if _, ok := requests.EventType_name[int32(ve.Type)]; !ok {
		// we don't recognise this event type, perhaps it's new and we haven't rebuilt against it
		err := fmt.Errorf("unrecognised event type %+v", ve.Type.String())
		logger.Errorf("Error processing: %s", err.Error())
		return err
	}

	mEv := b.client.newMixpanelEvent(ev.Topic, ve.Type.String(), customerID, ev.ID, ev.Timestamp.Unix(), ve)
	if err := b.client.Track(mEv); err != nil {
		logger.Errorf("Error tracking event %s", err)
		return err
	}
	return nil

}

func (b *Mixpanel) ignoreCustomer(customerID string) (bool, error) {
	// should we ignore?
	rsp, err := b.custSvc.Read(context.Background(), &customers.ReadRequest{Id: customerID}, client.WithAuthToken())
	if err != nil {
		merr, ok := err.(*merrors.Error)
		if ok {
			if merr.Code == 404 || merr.Detail == "not found" {
				logger.Errorf("Failed to find customer %s", customerID)
				return true, nil
			}
		}
		logger.Errorf("Failed to read customer %s %s", customerID, err)
		return false, err
	}
	for _, i := range b.ignoreList {
		if rsp.Customer.Email == i {
			return true, nil
		}
	}
	return false, nil

}

func (b *Mixpanel) processCustomerEvent(ev mevents.Event) error {
	ve := &customerspb.Event{}
	if err := json.Unmarshal(ev.Payload, ve); err != nil {
		logger.Errorf("Error unmarshalling balance event, discarding: $s", err)
		return nil
	}
	customerID := ve.Customer.Id
	if len(ve.Customer.Email) == 0 {
		rsp, err := b.custSvc.Read(context.Background(), &customers.ReadRequest{Id: customerID}, client.WithAuthToken())
		if err != nil {
			merr, ok := err.(*merrors.Error)
			if ok {
				if merr.Code == 404 || merr.Detail == "not found" {
					logger.Warnf("Failed to find customer %s", customerID)
					return nil
				}
			}
			logger.Errorf("Failed to read customer %s %s", customerID, err)
			return err
		}
		ve.Customer.Email = rsp.Customer.Email
		ve.Customer.Status = rsp.Customer.Status
		ve.Customer.Created = rsp.Customer.Created
		ve.Customer.Updated = rsp.Customer.Updated

	}
	for _, i := range b.ignoreList {
		if ve.Customer.Email == i {
			return nil
		}
	}
	if _, ok := customerspb.EventType_name[int32(ve.Type)]; !ok {
		// we don't recognise this event type, perhaps it's new and we haven't rebuilt against it
		err := fmt.Errorf("unrecognised event type %+v", ve.Type.String())
		logger.Errorf("Error processing: %s", err.Error())
		return err
	}

	mEv := b.client.newMixpanelEvent(ev.Topic, ve.Type.String(), customerID, ev.ID, ev.Timestamp.Unix(), ve)
	if err := b.client.Track(mEv); err != nil {
		logger.Errorf("Error tracking event %s", err)
		return err
	}

	return nil
}
