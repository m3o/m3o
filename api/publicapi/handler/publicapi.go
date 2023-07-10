package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/errors"
	"m3o.dev/platform/service/events"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	m3oauth "m3o.dev/api/pkg/auth"
	"m3o.dev/api/pkg/events/proto/publicapi"
	pb "m3o.dev/api/publicapi/proto"
)

const (
	prefixName = "apiByName:%s"
	prefixID   = "apiByID:%s"
)

type APIEntry struct {
	ID           string
	Name         string
	Description  string
	OpenAPIJSON  string
	Pricing      map[string]int64 // pricing mapping endpoints to price in 1/100 of a cent
	OwnerID      string
	ExamplesJSON string
	Category     string
	Icon         string
	PostmanJSON  string
	DisplayName  string
	Quotas       map[string]int64 // mapping endpoints to their free quotas
}

type Publicapi struct {
}

func NewPublicAPIHandler(srv *service.Service) *Publicapi {
	return &Publicapi{}
}

func (p *Publicapi) Publish(ctx context.Context, request *pb.PublishRequest, response *pb.PublishResponse) error {
	if _, err := m3oauth.VerifyMicroAdmin(ctx, "publicapi.Publish"); err != nil {
		return err
	}
	if request.Api == nil || len(request.Api.Name) == 0 {
		return errors.BadRequest("publicapi.Publish", "Missing API name")
	}
	id := uuid.New().String()
	// for now api name is also unique
	recs, err := store.Read(fmt.Sprintf(prefixName, request.Api.Name))
	if err != nil && err != store.ErrNotFound {
		return err
	}
	isUpdate := false
	if len(recs) > 0 {
		// update the existing
		var ae APIEntry
		if err := json.Unmarshal(recs[0].Value, &ae); err != nil {
			return err
		}
		id = ae.ID
		isUpdate = true
	}

	ownerId := request.Api.OwnerId
	if len(ownerId) == 0 {
		acc, _ := auth.AccountFromContext(ctx)
		ownerId = acc.ID
	}

	ae := &APIEntry{
		ID:           id,
		Name:         request.Api.Name,
		Description:  request.Api.Description,
		OpenAPIJSON:  request.Api.OpenApiJson,
		Pricing:      request.Api.Pricing,
		OwnerID:      ownerId,
		ExamplesJSON: request.Api.ExamplesJson,
		Category:     request.Api.Category,
		Icon:         request.Api.Icon,
		PostmanJSON:  request.Api.PostmanJson,
		DisplayName:  request.Api.DisplayName,
		Quotas:       request.Api.Quotas,
	}

	if err := p.updateEntry(ctx, ae); err != nil {
		return err
	}
	// enable auth rules
	// we need two rules, one for the /v1/foo/bar from public internet and one for v1->foo
	//micro auth create rule --resource="service:v1.helloworld:*" --priority 1 helloworld-v1
	//micro auth create rule --resource="service:helloworld:*" --priority 1 --scope '+' helloworld-internal
	if err := auth.Grant(&auth.Rule{
		ID:    fmt.Sprintf("%s-v1", ae.Name),
		Scope: "",
		Resource: &auth.Resource{
			Name:     fmt.Sprintf("v1.%s", ae.Name),
			Type:     "service",
			Endpoint: "*",
		},
		Access:   auth.AccessGranted,
		Priority: 1,
	}); err != nil && !strings.Contains(err.Error(), "already exists") {
		log.Errorf("Error adding rule %s", err)
		return errors.InternalServerError("publicapi.Publish", "Error enabling API")

	}

	if err := auth.Grant(&auth.Rule{
		ID:    fmt.Sprintf("%s-internal", ae.Name),
		Scope: "+",
		Resource: &auth.Resource{
			Name:     ae.Name,
			Type:     "service",
			Endpoint: "*",
		},
		Access:   auth.AccessGranted,
		Priority: 1,
	}); err != nil && !strings.Contains(err.Error(), "already exists") {
		log.Errorf("Error adding rule %s", err)
		return errors.InternalServerError("publicapi.Publish", "Error enabling API")
	}

	// event
	if isUpdate {
		if err := events.Publish(publicapi.Topic, publicapi.Event{
			Type: publicapi.EventType_EventTypeAPIUpdate,
			ApiUpdate: &publicapi.APIUpdate{
				Name: ae.Name,
			}}); err != nil {
			log.Errorf("Error publishing event %s", err)
		}
	} else {
		if err := events.Publish(publicapi.Topic, publicapi.Event{
			Type: publicapi.EventType_EventTypeAPIEnable,
			ApiEnable: &publicapi.APIEnable{
				Name: ae.Name,
			}}); err != nil {
			log.Errorf("Error publishing event %s", err)
		}
	}
	response.Api = marshal(ae)
	// TODO any other v1 things?
	return nil
}

func (p *Publicapi) updateEntry(ctx context.Context, ae *APIEntry) error {
	b, err := json.Marshal(ae)
	if err != nil {
		return err
	}
	// store it
	if err := store.Write(&store.Record{
		Key:   fmt.Sprintf(prefixName, ae.Name),
		Value: b,
	}); err != nil {
		log.Errorf("Error writing to store %s", err)
		return err
	}
	if err := store.Write(&store.Record{
		Key:   fmt.Sprintf(prefixID, ae.ID),
		Value: b,
	}); err != nil {
		log.Errorf("Error writing to store %s", err)
		return err
	}

	return nil
}

func (p *Publicapi) Get(ctx context.Context, request *pb.GetRequest, response *pb.GetResponse) error {
	var key string
	if len(request.Id) > 0 {
		key = fmt.Sprintf(prefixID, request.Id)
	} else if len(request.Name) > 0 {
		key = fmt.Sprintf(prefixName, request.Name)
	}
	if len(key) == 0 {
		return errors.BadRequest("publicapi.Get", "ID or name must be specified")
	}
	recs, err := store.Read(key)
	if err != nil {
		log.Errorf("Error reading from store %s", err)
		if err == store.ErrNotFound {
			return errors.NotFound("publicapi.Get", "API not found")
		}
		return errors.InternalServerError("publicapi.Get", "Error retrieving API")
	}
	var ae APIEntry
	if err := json.Unmarshal(recs[0].Value, &ae); err != nil {
		log.Errorf("Error marshalling API %s", err)
		return errors.InternalServerError("publicapi.Get", "Error retrieving API")
	}
	response.Api = marshal(&ae)
	return nil
}

func (p *Publicapi) List(ctx context.Context, request *pb.ListRequest, response *pb.ListResponse) error {
	recs, err := store.Read(fmt.Sprintf(prefixName, ""), store.ReadPrefix())
	if err != nil {
		log.Errorf("Error reading from store %s", err)
		return err
	}
	response.Apis = make([]*pb.PublicAPI, len(recs))
	for i, v := range recs {
		var ae APIEntry
		if err := json.Unmarshal(v.Value, &ae); err != nil {
			return err
		}
		response.Apis[i] = marshal(&ae)
	}
	return nil
}

func (p *Publicapi) Remove(ctx context.Context, request *pb.RemoveRequest, response *pb.RemoveResponse) error {
	if _, err := m3oauth.VerifyMicroAdmin(ctx, "publicapi.Remove"); err != nil {
		return err
	}
	var key string
	if len(request.Id) > 0 {
		key = fmt.Sprintf(prefixID, request.Id)
	} else if len(request.Name) > 0 {
		key = fmt.Sprintf(prefixName, request.Name)
	}
	if len(key) == 0 {
		return errors.BadRequest("publicapi.Remove", "ID or name must be specified")
	}
	recs, err := store.Read(key)
	if err != nil {
		return err
	}
	var ae APIEntry
	if err := json.Unmarshal(recs[0].Value, &ae); err != nil {
		return err
	}

	// delete entries
	if err := store.Delete(fmt.Sprintf(prefixID, ae.ID)); err != nil {
		return errors.InternalServerError("publicapi.Remove", "Error removing API")
	}
	if err := store.Delete(fmt.Sprintf(prefixName, ae.Name)); err != nil {
		return errors.InternalServerError("publicapi.Remove", "Error removing API")
	}
	// delete rules

	if err := auth.Revoke(&auth.Rule{
		ID: fmt.Sprintf("%s-v1", ae.Name),
	}); err != nil {
		log.Errorf("Error deleting rule %s", err)
		return errors.InternalServerError("publicapi.Remove", "Error removing API")
	}

	if err := auth.Revoke(&auth.Rule{
		ID: fmt.Sprintf("%s-internal", ae.Name),
	}); err != nil {
		log.Errorf("Error deleting rule %s", err)
		return errors.InternalServerError("publicapi.Remove", "Error removing API")
	}

	// event
	if err := events.Publish(publicapi.Topic, publicapi.Event{
		Type: publicapi.EventType_EventTypeAPIDisable,
		ApiDisable: &publicapi.APIDisable{
			Name: ae.Name,
		}}); err != nil {
		log.Errorf("Error publishing event %s", err)
	}

	return nil
}

func (p *Publicapi) Update(ctx context.Context, request *pb.UpdateRequest, response *pb.UpdateResponse) error {
	if _, err := m3oauth.VerifyMicroAdmin(ctx, "publicapi.Update"); err != nil {
		return err
	}
	// work out which fields have been passed and update
	recs, err := store.Read(fmt.Sprintf(prefixID, request.Api.Id))
	if err != nil {
		if err == store.ErrNotFound {
			return errors.NotFound("publicapi.Update", "API not found with this ID")
		}
		return errors.InternalServerError("publicapi.Update", "Error updating API")
	}
	var ae APIEntry
	if err := json.Unmarshal(recs[0].Value, &ae); err != nil {
		log.Errorf("Error unmarshalling %s", err)
		return errors.InternalServerError("publicapi.Update", "Error updating API")
	}
	if len(request.Api.OpenApiJson) > 0 {
		ae.OpenAPIJSON = request.Api.OpenApiJson
	}
	if len(request.Api.Name) > 0 {
		ae.Name = request.Api.Name
	}
	if len(request.Api.Description) > 0 {
		ae.Description = request.Api.Description
	}
	if len(request.Api.Pricing) > 0 {
		ae.Pricing = request.Api.Pricing
	}
	if len(request.Api.ExamplesJson) > 0 {
		ae.ExamplesJSON = request.Api.ExamplesJson
	}
	if len(request.Api.Category) > 0 {
		ae.Category = request.Api.Category
	}
	if len(request.Api.Icon) > 0 {
		ae.Category = request.Api.Icon
	}
	if len(request.Api.PostmanJson) > 0 {
		ae.PostmanJSON = request.Api.PostmanJson
	}
	if len(request.Api.Quotas) > 0 {
		ae.Quotas = request.Api.Quotas
	}

	if err := p.updateEntry(ctx, &ae); err != nil {
		log.Errorf("Error updating entry %s", err)
		return errors.InternalServerError("publicapi.Update", "Error updating API")
	}
	response.Api = marshal(&ae)
	return nil
}

func marshal(ae *APIEntry) *pb.PublicAPI {
	ret := &pb.PublicAPI{
		Id:           ae.ID,
		Name:         ae.Name,
		Description:  ae.Description,
		OpenApiJson:  ae.OpenAPIJSON,
		Pricing:      ae.Pricing,
		OwnerId:      ae.OwnerID,
		ExamplesJson: ae.ExamplesJSON,
		Category:     ae.Category,
		Icon:         ae.Icon,
		PostmanJson:  ae.PostmanJSON,
		DisplayName:  ae.DisplayName,
		Quotas:       ae.Quotas,
	}
	// hack while we transition to everything having a display name
	if ret.DisplayName == "" {
		ret.DisplayName = ret.Name
	}
	return ret
}
