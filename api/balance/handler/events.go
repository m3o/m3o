package handler

import (
	"context"
	"encoding/json"
	"math"
	"strconv"

	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/events"
	mevents "m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	pevents "m3o.dev/api/pkg/events"
	eventspb "m3o.dev/api/pkg/events/proto/customers"
	"m3o.dev/api/pkg/events/proto/requests"
	stripeevents "m3o.dev/api/pkg/events/proto/stripe"
	stripepb "m3o.dev/api/stripe/proto"
)

func (b *Balance) consumeEvents() {
	go pevents.ProcessTopic(requests.Topic, "balance", b.processV1apiEvents)
	go pevents.ProcessTopic(stripeevents.Topic, "balance", b.processStripeEvents)
	go pevents.ProcessTopic(eventspb.Topic, "balance", b.processCustomerEvents)
}

func (b *Balance) processV1apiEvents(ev mevents.Event) error {
	ctx := context.Background()
	ve := &requests.Event{}
	if err := json.Unmarshal(ev.Payload, ve); err != nil {
		logger.Errorf("Error unmarshalling v1 event: $s", err)
		return nil
	}
	switch ve.Type {
	case requests.EventType_EventTypeRequest:
		if err := b.processRequest(ctx, ve.Request); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	default:
		logger.Infof("Skipped event %+v", ve)

	}
	return nil

}

func (b *Balance) processRequest(ctx context.Context, rqe *requests.Request) error {
	// rqe.Price should be either "free" or a valid number
	price, err := strconv.Atoi(rqe.Price)
	if err != nil {
		return nil
	}

	// TODO projects switch to using rqe.ProjectID
	// decrement the balance
	currBal, err := b.c.decr(ctx, rqe.UserId, "$balance$", int64(price))
	if err != nil {
		return err
	}

	if currBal > 0 {
		return nil
	}

	evt := &eventspb.Event{
		Type: eventspb.EventType_EventTypeBalanceZero,
		Customer: &eventspb.Customer{
			Id: rqe.UserId,
		},
		ProjectId: rqe.UserId,
	}
	if err := events.Publish(eventspb.Topic, evt); err != nil {
		logger.Errorf("Error publishing event %+v", evt)
	}

	return nil
}

func (b *Balance) processStripeEvents(ev mevents.Event) error {
	ctx := context.Background()
	ve := &stripeevents.Event{}
	logger.Infof("Processing event %+v", ev)
	if err := json.Unmarshal(ev.Payload, ve); err != nil {
		logger.Errorf("Error unmarshalling stripe event: $s", err)
		return nil
	}
	switch ve.Type {
	case stripeevents.EventType_EventTypeChargeSucceeded:
		if err := b.processChargeSucceeded(ctx, ve.ChargeSucceeded); err != nil {
			logger.Errorf("Error processing charge succeeded event %s", err)
			return err
		}
	default:
		logger.Infof("Skipping event %+v", ve)

	}
	return nil

}

func (b *Balance) processChargeSucceeded(ctx context.Context, ev *stripeevents.ChargeSuceeded) error {

	// safety first
	if ev == nil || ev.Amount == 0 {
		return nil
	}

	srsp, err := b.stripeSvc.GetPayment(ctx, &stripepb.GetPaymentRequest{Id: ev.ChargeId}, client.WithAuthToken())
	if err != nil {
		return err
	}

	// TODO PROJECTS
	// lookup customer ID's projects. If they have just one project then credit it straight to that balance. If they have
	// multiple projects then credit this to a master balance, ready to be allocated
	// if a project is deleted we need to reallocate the balance. If only one project left sweep everything in to
	// the remaining project. If multiple then sweep it back in to the parent account balance
	amt := ev.Amount * 10000
	description := "Credit added"
	margin := float64(0.0)

	if srsp.Payment.Description != "M3O credit" {
		description = "Subscription credit added"
		margin = b.margin
	}

	// apply margin
	amt = int64(math.Ceil(float64(amt) * (1 - margin)))

	adj, err := storeAdjustment(ev.CustomerId, amt, ev.CustomerId, description, true, map[string]string{
		"receipt_url": srsp.Payment.ReceiptUrl,
	})
	if err != nil {
		return err
	}

	// add to balance. We do this LAST in case we error doing anything else and cause a double count
	// stripe event is in cents, multiply by 10000 to get the fraction that balance represents
	_, err = b.c.incr(ctx, ev.CustomerId, "$balance$", amt)
	if err != nil {
		logger.Errorf("Error incrementing balance %s", err)
	}

	evt := &eventspb.Event{
		Type: eventspb.EventType_EventTypeBalanceIncrement,
		BalanceIncrement: &eventspb.BalanceIncrement{
			Amount:    adj.Amount,
			Type:      "topup",
			Reference: adj.Reference,
		},
		Customer: &eventspb.Customer{
			Id: adj.CustomerID,
		},
		//ProjectId: TODO PROJECTS
	}

	if err := events.Publish(eventspb.Topic, evt); err != nil {
		logger.Errorf("Error publishing event %+v", evt)
	}

	return nil
}

func (b *Balance) processCustomerEvents(ev mevents.Event) error {
	ctx := context.Background()
	ce := &eventspb.Event{}
	if err := json.Unmarshal(ev.Payload, ce); err != nil {
		logger.Errorf("Error unmarshalling customer event: $s", err)
		return nil
	}
	switch ce.Type {
	case eventspb.EventType_EventTypeDeleted:
		if err := b.processCustomerDelete(ctx, ce); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	default:
		logger.Infof("Skipping event %+v", ce)
	}
	return nil

}

func (b *Balance) processCustomerDelete(ctx context.Context, event *eventspb.Event) error {
	// TODO PROJECTS delete any parent balance account. User a project deleted event to trigger delete of the balances
	// delete all their balances
	if err := b.deleteCustomer(ctx, event.Customer.Id); err != nil {
		logger.Errorf("Error deleting customer %s", err)
		return err
	}
	return nil
}
