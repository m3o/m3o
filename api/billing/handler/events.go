package handler

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	mevents "m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	pevents "m3o.dev/api/pkg/events"
	custpb "m3o.dev/api/pkg/events/proto/customers"
)

func (b *Billing) consumeEvents() {
	go pevents.ProcessTopic(custpb.Topic, "billing", b.processCustomerEvents)
}

func (b *Billing) processCustomerEvents(ev mevents.Event) error {
	ctx := context.Background()
	ce := &custpb.Event{}
	if err := json.Unmarshal(ev.Payload, ce); err != nil {
		logger.Errorf("Error unmarshalling customer event: $s", err)
		return nil
	}
	switch ce.Type {
	case custpb.EventType_EventTypeDeleted:
		if err := b.processCustomerDelete(ctx, ce); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	case custpb.EventType_EventTypeCreated:
		if err := b.processCustomerCreate(ctx, ce); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	case custpb.EventType_EventTypeAddPaymentMethod:
		if err := b.processAddPaymentMethod(ctx, ce); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	default:
		logger.Infof("Skipping event %+v", ce)
	}
	return nil

}

const (
	prefixAccByID    = "accByID"
	prefixAccByAdmin = "accByAdmin"
)

func billingAccKey(id string) string {
	return fmt.Sprintf("%s/%s", prefixAccByID, id)
}

func adminKey(userID string) string {
	return fmt.Sprintf("%s/%s", prefixAccByAdmin, userID)
}

func (b *Billing) processAddPaymentMethod(ctx context.Context, event *custpb.Event) error {
	// add a billing account if required
	// does the user who added the card have a billing account already?
	recs, err := store.Read(adminKey(event.Customer.Id))
	if err != nil && err != store.ErrNotFound {
		// try again
		logger.Errorf("Error looking up billing account %s", err)
		return err
	}
	if len(recs) > 0 {
		// nothing to do, billing acc already exists for this user
		return nil
	}
	// create a new billing account
	billingAcc := BillingAccount{
		ID:      uuid.New().String(),
		Admins:  []string{event.Customer.Id},
		PriceID: "free",
	}
	return b.storeBillingAccount(&billingAcc)
}

func (b *Billing) storeBillingAccount(billingAcc *BillingAccount) error {
	for _, v := range billingAcc.Admins {
		if err := store.Write(store.NewRecord(adminKey(v), billingAcc)); err != nil {
			logger.Errorf("Error storing billing account %s", err)
			return err
		}
	}
	if err := store.Write(store.NewRecord(billingAccKey(billingAcc.ID), billingAcc)); err != nil {
		logger.Errorf("Error storing billing account %s", err)
		return err
	}
	return nil
}

func (b *Billing) processCustomerDelete(ctx context.Context, event *custpb.Event) error {
	recs, err := store.Read(adminKey(event.Customer.Id))
	if err != nil && err != store.ErrNotFound {
		logger.Errorf("Error looking for billing account %s", err)
		return err
	}
	if len(recs) == 0 {
		return nil
	}
	var billAcc BillingAccount
	if err := json.Unmarshal(recs[0].Value, &billAcc); err != nil {
		logger.Errorf("Error unmarshalling acc %s", err)
		return nil
	}
	if len(billAcc.Admins) != 1 {
		// remove this user as admin
		admins := []string{}
		for _, v := range billAcc.Admins {
			if v == event.Customer.Id {
				continue
			}
			admins = append(admins, v)
		}
		billAcc.Admins = admins
		if err := b.storeBillingAccount(&billAcc); err != nil {
			return err
		}

	} else {
		// deletee the entry
		if err := store.Delete(billingAccKey(billAcc.ID)); err != nil {
			return err
		}
	}

	// delete the entry for this admin
	if err := store.Delete(adminKey(event.Customer.Id)); err != nil {
		return err
	}

	return nil
}

func (b *Billing) processCustomerCreate(ctx context.Context, event *custpb.Event) error {
	return nil
}
