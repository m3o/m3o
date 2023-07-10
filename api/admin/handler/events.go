package handler

import (
	"context"
	"encoding/json"

	"m3o.dev/platform/service/client"
	mevents "m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/registry"
	pevents "m3o.dev/api/pkg/events"
	eventspb "m3o.dev/api/pkg/events/proto/customers"
)

const (
	totalID = "total"
)

func (a *Admin) consumeEvents() {
	go pevents.ProcessTopic(eventspb.Topic, "admin", a.processCustomerEvents)
}

func (a *Admin) processCustomerEvents(ev mevents.Event) error {
	ctx := context.Background()
	ce := &eventspb.Event{}
	if err := json.Unmarshal(ev.Payload, ce); err != nil {
		logger.Errorf("Error unmarshalling customer event: $s", err)
		return nil
	}
	switch ce.Type {
	case eventspb.EventType_EventTypeDeleted:
		if err := a.processCustomerDelete(ctx, ce); err != nil {
			logger.Errorf("Error processing request event %s", err)
			return err
		}
	default:
		logger.Infof("Skipping event %+v", ce)
	}
	return nil

}

const (
	deleteDataEndpoint = "Admin.DeleteData"
)

func (a *Admin) processCustomerDelete(ctx context.Context, event *eventspb.Event) error {
	// TODO PROJECTS this will need to be updated to delete use project ID as the tenant ID
	// delete against all services
	return a.deleteData(ctx, "micro/"+event.Customer.Id) // TODO don't hardcode namespace
}

func (a *Admin) deleteData(ctx context.Context, tenantID string) error {
	b, _ := json.Marshal(map[string]string{"tenant_id": tenantID})
	svcs, err := registry.ListServices()
	if err != nil {
		return err
	}
	services := []string{}
	for _, svc := range svcs {
		for _, ep := range svc.Endpoints {
			if ep.Name == deleteDataEndpoint && svc.Name != "admin" {
				services = append(services, svc.Name)
				break
			}
		}
	}
	for _, service := range services {
		request := client.DefaultClient.NewRequest(
			service,
			deleteDataEndpoint,
			json.RawMessage(b),
			client.WithContentType("application/json"),
		)
		// create request/response
		var response json.RawMessage
		// make the call
		if err := client.Call(ctx, request, &response, client.WithAuthToken()); err != nil {
			logger.Errorf("Error deleting data for %s %s, err", tenantID, service, err)
		}
	}
	return nil
}
