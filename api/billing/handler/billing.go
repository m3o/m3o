package handler

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/errors"
	"m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	billing "m3o.dev/api/billing/proto"
	customer "m3o.dev/api/customers/proto"
	"m3o.dev/api/pkg/auth"
	custevents "m3o.dev/api/pkg/events/proto/customers"
	stripe "m3o.dev/api/stripe/proto"
)

type Billing struct {
	stripeSvc stripe.StripeService
	custSvc   customer.CustomersService
	tiers     map[string]string
}

type Tier struct {
	ID        string
	Name      string
	PriceDesc string // human readable string to describe the price $25/month or $45 per user / month
	Price     int64  // price in base units
	Currency  string // currency
}

// BillingAccount is the entity that owns the subscription, etc
type BillingAccount struct {
	ID      string
	Admins  []string // a billing account can have multiple admins, but an admin can only admin one account
	PriceID string   // ID of the Stripe price for the subscription tier, "free" or  "price_198234aksjfh"
	SubID   string   // Stripe subscription ID "sub_1o283yklajdfn"
}

func New(svc *service.Service) *Billing {
	val, err := config.Get("micro.billing.tiers")
	if err != nil {
		log.Fatalf("Failed to load config")
	}
	tiers := map[string]string{}
	if err := val.Scan(&tiers); err != nil {
		log.Fatalf("Failed to load config")
	}
	bill := &Billing{
		stripeSvc: stripe.NewStripeService("stripe", svc.Client()),
		tiers:     tiers,
		custSvc:   customer.NewCustomersService("customers", svc.Client()),
	}
	bill.consumeEvents()
	return bill
}

func (b *Billing) lookupPriceID(tierID string) string {
	return b.tiers[tierID]
}

func (b *Billing) lookupTierID(priceID string) string {
	for k, v := range b.tiers {
		if v == priceID {
			return k
		}
	}
	return ""
}

// SubscribeTier sets up a user/team to be subscribed to a tier.
func (b *Billing) SubscribeTier(ctx context.Context, request *billing.SubscribeTierRequest, response *billing.SubscribeTierResponse) error {
	method := "billing.SubscribeTier"
	acc, err := auth.VerifyMicroCustomer(ctx, method)
	if err != nil {
		return err
	}
	// lookup this customer's billing acc which should have been set when they added their card
	recs, err := store.Read(adminKey(acc.ID))
	if err != nil && err != store.ErrNotFound {
		log.Errorf("Error processing subscription %s", err)
		return errors.InternalServerError(method, "Error processing subscription, please try again")
	}
	if len(recs) == 0 {
		log.Errorf("No billing account found for user %s", acc.ID)
		return errors.InternalServerError(method, "Error processing subscription, please try again")
	}
	var billingAcc BillingAccount
	if err := json.Unmarshal(recs[0].Value, &billingAcc); err != nil {
		log.Errorf("Error unmarshalling billing acc %s", err)
		return errors.InternalServerError(method, "Error processing subscription, please try again")
	}

	priceID := b.lookupPriceID(request.Id)
	if len(priceID) == 0 {
		return errors.BadRequest(method, "Subscription ID not valid")
	}

	// Set up sub in Stripe
	// - cancel existing (if any)
	// - set up new (if not free tier)
	if len(billingAcc.SubID) > 0 {
		_, err := b.stripeSvc.Unsubscribe(ctx, &stripe.UnsubscribeRequest{SubscriptionId: billingAcc.SubID})
		if err != nil {
			log.Errorf("Error unsubscribing %s", err)
			return errors.InternalServerError(method, "Error processing subscription, please try again")
		}
	}

	subID := ""
	if priceID != "free" {
		rsp, err := b.stripeSvc.Subscribe(ctx, &stripe.SubscribeRequest{
			PriceId: priceID,
			CardId:  request.CardId,
		})
		if err != nil {
			log.Errorf("Error subscribing %s", err)
			return errors.InternalServerError(method, "Error processing subscription. please try again")
		}
		subID = rsp.SubscriptionId
	}

	// Update billing acc
	billingAcc.SubID = subID
	billingAcc.PriceID = priceID
	if err := b.storeBillingAccount(&billingAcc); err != nil {
		return errors.InternalServerError(method, "Error processing subscription. please try again")
	}
	// fire event
	evt := &custevents.Event{
		Type: custevents.EventType_EventTypeSubscriptionChanged,
		Customer: &custevents.Customer{
			Id: acc.ID,
		},
		SubscriptionChanged: &custevents.SubscriptionChanged{Tier: request.Id},
	}
	if err := events.Publish(custevents.Topic, evt); err != nil {
		logger.Errorf("Error publishing event %+v %s", evt, err)
	}

	return nil
}

func (b *Billing) ReadAccount(ctx context.Context, request *billing.ReadAccountRequest, response *billing.ReadAccountResponse) error {
	method := "billing.ReadAccount"
	key := ""
	adminID := ""
	acc, err := auth.VerifyMicroAdmin(ctx, method)
	if err != nil {
		acc, err = auth.VerifyMicroCustomer(ctx, method)
		if err != nil {
			return err
		}
		key = adminKey(acc.ID)
		adminID = acc.ID
	} else {
		if len(request.Id) > 0 {
			key = billingAccKey(request.Id)
		} else if len(request.AdminId) > 0 {
			adminID = request.AdminId
			key = adminKey(request.AdminId)
		} else {
			return errors.BadRequest(method, "Missing id or admin_id param")
		}
	}

	recs, err := store.Read(key)
	if err != nil && err != store.ErrNotFound {
		log.Errorf("Error processing read %s", err)
		return errors.InternalServerError(method, "Error processing read, please try again")
	}
	var billingAcc BillingAccount
	if len(recs) == 0 {
		if adminID == "" {
			return errors.NotFound(method, "Not found")
		}
		// make sure we're not trying to create an account for someone that doesn't exist
		if _, err := b.custSvc.Read(ctx, &customer.ReadRequest{Id: adminID}, client.WithAuthToken()); err != nil {
			return errors.NotFound(method, "Not found")
		}

		log.Infof("No billing account found for user %s, creating", acc.ID)
		billingAcc = BillingAccount{
			ID:      uuid.New().String(),
			Admins:  []string{adminID},
			PriceID: "free",
		}
		if err := b.storeBillingAccount(&billingAcc); err != nil {
			log.Errorf("Error processing read %s", err)
			return errors.InternalServerError(method, "Error processing read, please try again")
		}
	} else {
		if err := json.Unmarshal(recs[0].Value, &billingAcc); err != nil {
			log.Errorf("Error unmarshalling billing acc %s", err)
			return errors.InternalServerError(method, "Error processing read, please try again")
		}
	}
	response.BillingAccount = &billing.BillingAccount{
		Id:            billingAcc.ID,
		Admins:        billingAcc.Admins,
		Subscriptions: []*billing.Subscription{{Id: b.lookupTierID(billingAcc.PriceID)}},
	}
	return nil
}

func (b *Billing) CreateCheckoutSession(ctx context.Context, request *billing.CreateCheckoutSessionRequest, response *billing.CreateCheckoutSessionResponse) error {
	rsp, err := b.stripeSvc.CreateCheckoutSession(ctx, &stripe.CreateCheckoutSessionRequest{
		Amount:   request.Amount,
		SaveCard: request.SaveCard,
	})
	if err != nil {
		return err
	}
	response.Id = rsp.Id
	return nil
}

func (b *Billing) ListCards(ctx context.Context, request *billing.ListCardsRequest, response *billing.ListCardsResponse) error {
	rsp, err := b.stripeSvc.ListCards(ctx, &stripe.ListCardsRequest{})
	if err != nil {
		return err
	}
	response.Cards = make([]*billing.Card, len(rsp.Cards))
	for i, v := range rsp.Cards {
		response.Cards[i] = &billing.Card{
			Id:       v.Id,
			LastFour: v.LastFour,
			Expires:  v.Expires,
		}
	}
	return nil
}

func (b *Billing) ChargeCard(ctx context.Context, request *billing.ChargeCardRequest, response *billing.ChargeCardResponse) error {
	rsp, err := b.stripeSvc.ChargeCard(ctx, &stripe.ChargeCardRequest{
		Id:     request.Id,
		Amount: request.Amount,
	})
	if err != nil {
		return err
	}
	response.ClientSecret = rsp.ClientSecret
	return nil
}

func (b *Billing) DeleteCard(ctx context.Context, request *billing.DeleteCardRequest, response *billing.DeleteCardResponse) error {
	_, err := b.stripeSvc.DeleteCard(ctx, &stripe.DeleteCardRequest{Id: request.Id})
	return err
}

func (b *Billing) ListPayments(ctx context.Context, request *billing.ListPaymentsRequest, response *billing.ListPaymentsResponse) error {
	rsp, err := b.stripeSvc.ListPayments(ctx, &stripe.ListPaymentsRequest{})
	if err != nil {
		return err
	}
	response.Payments = make([]*billing.Payment, len(rsp.Payments))
	for i, v := range rsp.Payments {
		response.Payments[i] = &billing.Payment{
			Id:         v.Id,
			Amount:     v.Amount,
			Currency:   v.Currency,
			Date:       v.Date,
			ReceiptUrl: v.ReceiptUrl,
		}
	}
	return nil
}

func (b *Billing) GetPayment(ctx context.Context, request *billing.GetPaymentRequest, response *billing.GetPaymentResponse) error {
	rsp, err := b.stripeSvc.GetPayment(ctx, &stripe.GetPaymentRequest{Id: request.Id})
	if err != nil {
		return err
	}
	if rsp.Payment != nil {
		response.Payment = &billing.Payment{
			Id:         rsp.Payment.Id,
			Amount:     rsp.Payment.Amount,
			Currency:   rsp.Payment.Currency,
			Date:       rsp.Payment.Date,
			ReceiptUrl: rsp.Payment.ReceiptUrl,
		}
	}
	return nil
}

func (b *Billing) SetupCard(ctx context.Context, request *billing.SetupCardRequest, response *billing.SetupCardResponse) error {
	rsp, err := b.stripeSvc.SetupCard(ctx, &stripe.SetupCardRequest{})
	if err != nil {
		return err
	}
	response.ClientSecret = rsp.ClientSecret
	return nil
}
