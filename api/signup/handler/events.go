package handler

import (
	"context"
	"encoding/json"
	"log"
	"strings"
	"time"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/config"
	mevents "m3o.dev/platform/service/events"
	logger "m3o.dev/platform/service/logger"
	balance "m3o.dev/api/balance/proto"
	customer "m3o.dev/api/customers/proto"
	emails "m3o.dev/api/emails/proto"
	pevents "m3o.dev/api/pkg/events"
	custpb "m3o.dev/api/pkg/events/proto/customers"
)

type Onboarding struct {
	emailSvc emails.EmailsService
	custSvc  customer.CustomersService
	balSvc   balance.BalanceService
	cfg      conf
}

func NewOnboarding(svc *service.Service) *Onboarding {
	cfg := conf{}
	v, err := config.Get("micro.signup")
	if err != nil {
		log.Fatalf("Failed to load config %s", err)
	}
	if err := v.Scan(&cfg); err != nil {
		log.Fatalf("Failed to load config %s", err)
	}
	o := &Onboarding{
		emailSvc: emails.NewEmailsService("emails", svc.Client()),
		custSvc:  customer.NewCustomersService("customers", svc.Client()),
		balSvc:   balance.NewBalanceService("balance", svc.Client()),
		cfg:      cfg,
	}
	o.consumeEvents()
	return o
}

func (o *Onboarding) consumeEvents() {
	go pevents.ProcessTopic(custpb.Topic, "signup", o.processCustomerEvents)
}

func (o *Onboarding) processCustomerEvents(ev mevents.Event) error {
	ctx := context.Background()
	ce := &custpb.Event{}
	if err := json.Unmarshal(ev.Payload, ce); err != nil {
		logger.Errorf("Error unmarshalling customer event: $s", err)
		return nil
	}
	switch ce.Type {
	case custpb.EventType_EventTypeCreated:
		if err := o.processCustomerCreate(ctx, ce); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	default:
		logger.Infof("Skipping event %+v", ce)
	}
	return nil

}

func (o *Onboarding) processCustomerCreate(ctx context.Context, event *custpb.Event) error {
	// Send welcome email
	email := event.Customer.Email
	if len(email) == 0 {
		// look it up
		rsp, err := o.custSvc.Read(ctx, &customer.ReadRequest{Id: event.Customer.Id}, client.WithAuthToken())
		if err != nil {
			if strings.Contains(strings.ToLower(err.Error()), "not found") {
				return nil
			}
			return err
		}
		email = rsp.Customer.Email
	}
	for _, blocked := range o.cfg.EngagementBlockList {
		if blocked == email {
			return nil
		}
	}

	// apply promo credit if set
	if o.cfg.PromoCredit > 0 {
		// add a promo credit to their balance
		_, err := o.balSvc.Increment(context.Background(), &balance.IncrementRequest{
			CustomerId: event.Customer.Id,
			Delta:      o.cfg.PromoCredit,
			Visible:    true,
			Reference:  o.cfg.PromoMessage,
		}, client.WithAuthToken())

		logger.Error("Failed to apply promo credit for %s: %v", event.Customer.Id, err)
	}

	delay := o.cfg.WelcomeDelay
	if len(delay) == 0 {
		delay = "24h"
	}
	dur, _ := time.ParseDuration(delay)

	// TODO add a block list
	if _, err := o.emailSvc.Send(ctx, &emails.SendRequest{
		To:         email,
		TemplateId: o.cfg.Sendgrid.WelcomeTemplateID,
		SendAt:     time.Now().Add(dur).Unix(),
	}, client.WithAuthToken()); err != nil {
		logger.Errorf("Error sending mail %s", err)
		return err
	}

	return nil
}
