package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	mevents "m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	"github.com/stripe/stripe-go/v71"
	stripeclient "github.com/stripe/stripe-go/v71/client"
	pevents "m3o.dev/api/pkg/events"
	eventspb "m3o.dev/api/pkg/events/proto/customers"
)

func (s *Stripe) consumeEvents() {
	go pevents.ProcessTopic(eventspb.Topic, "stripe", s.processCustomerEvents)
}

func (s *Stripe) processCustomerEvents(ev mevents.Event) error {
	ctx := context.Background()
	ce := &eventspb.Event{}
	if err := json.Unmarshal(ev.Payload, ce); err != nil {
		logger.Errorf("Error unmarshalling customer event: $s", err)
		return nil
	}
	switch ce.Type {
	case eventspb.EventType_EventTypeDeleted:
		if err := s.processCustomerDelete(ctx, ce); err != nil {
			logger.Errorf("Error processing customer delete event %s", err)
			return err
		}
	default:
		logger.Infof("Skipping event %+v", ce)
	}
	return nil

}

func (s *Stripe) processCustomerDelete(ctx context.Context, event *eventspb.Event) error {
	// delete from stripe and delete our mapping
	recs, err := store.Read(fmt.Sprintf(prefixM3OID, event.Customer.Id))
	if err != nil {
		if err != store.ErrNotFound {
			logger.Errorf("Error processing customer delete %s", err)
			return err
		}
		logger.Errorf("Failed to find customer's Stripe entry for deletion")
		return nil
	}
	var cm CustomerMapping
	if err := json.Unmarshal(recs[0].Value, &cm); err != nil {
		return err
	}
	var client *stripeclient.API
	if strings.HasSuffix(event.Customer.Email, "@m3o.com") {
		client = s.testClient
	} else {
		client = s.client
	}
	_, err = client.Customers.Del(cm.StripeID, &stripe.CustomerParams{})
	if err != nil {
		return err
	}
	return s.deleteMapping(&cm)
}
