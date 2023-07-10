package handler

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	authpb "m3o.dev/platform/proto/auth"
	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/errors"
	"m3o.dev/platform/service/events"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	m3oauth "m3o.dev/api/pkg/auth"
	eventspb "m3o.dev/api/pkg/events/proto/customers"
	projects "m3o.dev/api/projects/proto"
	pb "m3o.dev/api/v1/proto"
)

type keyStatus string

const (
	keyStatusActive  = "active"
	keyStatusBlocked = "blocked" // blocked - probably because they've run out of money
)

type apiKeyRecord struct {
	ID            string    `json:"id"`            // id of the key
	ApiKey        string    `json:"apiKey"`        // hashed api key
	Scopes        []string  `json:"scopes"`        // the scopes this key has granted
	UserID        string    `json:"userID"`        // the ID of the key's owner
	AccID         string    `json:"accID"`         // the ID of the service account
	Description   string    `json:"description"`   // optional description of the API key as given by user
	Namespace     string    `json:"namespace"`     // the namespace that this user belongs to (only because technically user IDs aren't globally unique)
	Token         string    `json:"token"`         // the short lived JWT token
	Created       int64     `json:"created"`       // creation time
	Status        keyStatus `json:"status"`        // status of the key
	StatusMessage string    `json:"statusMessage"` // message to go with the status updated, presented to users
	LastSeen      int64     `json:"lastSeen"`      // last time this key was used successfully
}

// GenerateKey generates an API key
func (v1 *V1) GenerateKey(ctx context.Context, req *pb.GenerateKeyRequest, rsp *pb.GenerateKeyResponse) error {
	method := "v1.GenerateKey"
	if len(req.Scopes) == 0 {
		return errors.BadRequest(method, "Missing scopes field")
	}
	if len(req.Description) == 0 {
		return errors.BadRequest(method, "Missing description field")
	}

	acc, err := m3oauth.VerifyMicroCustomer(ctx, method)
	if err != nil {
		return err
	}
	// are they allowed to generate with the requested scopes?
	if !v1.checkRequestedScopes(ctx, req.Scopes) {
		return errors.Forbidden(method, "Not allowed to generate a key with requested scopes")
	}

	id, err := uuid.NewRandom()
	if err != nil {
		return errors.InternalServerError(method, "Failed to generate api key")
	}

	apiKey := base64.StdEncoding.EncodeToString([]byte(id.String()))
	hashedKey, err := hashSecret(apiKey)
	if err != nil {
		log.Errorf("Error hashing api key %s", err)
		return errors.InternalServerError(method, "Failed to generate api key")
	}

	// TODO, project ID should be passed in on request
	// which project are we assigning this to?
	projRsp, err := v1.projSvc.List(ctx, &projects.ListRequest{})
	if err != nil {
		log.Errorf("Error retrieving project list %s", err)
		return errors.InternalServerError(method, "Failed to generate api key")
	}
	// TODO take project ID as param
	if len(projRsp.Projects) != 1 {
		log.Errorf("Unable to determine which project to assign to key %+v", projRsp.Projects)
		return errors.InternalServerError(method, "Failed to generate api key")
	}
	keyOwner := projRsp.Projects[0].Id

	// api key is the secret for a new account
	// generate the new account + short lived access token for it
	authAcc, err := auth.Generate(
		uuid.New().String(),
		auth.WithSecret(apiKey),
		auth.WithIssuer(acc.Issuer),
		auth.WithType("apikey"),
		auth.WithScopes(req.Scopes...),
		auth.WithMetadata(map[string]string{"apikey_owner": keyOwner}),
	)
	if err != nil {
		log.Errorf("Error generating auth account %s", err)
		return errors.InternalServerError(method, "Failed to generate api key")
	}
	tok, err := auth.Token(
		auth.WithCredentials(authAcc.ID, apiKey),
		auth.WithTokenIssuer(acc.Issuer),
		auth.WithExpiry(1*time.Hour))
	if err != nil {
		log.Errorf("Error generating token %s", err)
		return errors.InternalServerError(method, "Failed to generate api key")
	}
	// hash API key and store with scopes
	rec := apiKeyRecord{
		ID:          uuid.New().String(),
		ApiKey:      hashedKey,
		Scopes:      req.Scopes,
		UserID:      keyOwner,
		Namespace:   acc.Issuer,
		Description: req.Description,
		AccID:       authAcc.ID,
		Token:       tok.AccessToken,
		Created:     time.Now().Unix(),
		Status:      keyStatusActive,
	}
	if err := v1.writeAPIRecord(ctx, &rec); err != nil {
		log.Errorf("Failed to write api record %s", err)
		return errors.InternalServerError(method, "Failed to generate api key")
	}

	if err := events.Publish(eventspb.Topic, eventspb.Event{
		Type: eventspb.EventType_EventTypeGenerateKey,
		Customer: &eventspb.Customer{
			Id:    acc.ID,
			Email: acc.Name,
		},
		GenerateKey: &eventspb.GenerateKey{
			Scopes: rec.Scopes,
			Id:     rec.ID,
		},
		ProjectId: acc.ID,
	}); err != nil {
		log.Errorf("Error publishing event %s", err)
	}
	// return the unhashed key
	rsp.ApiKey = apiKey
	rsp.ApiKeyId = rec.ID
	return nil
}

// ListKeys lists all keys for a user
func (v1 *V1) ListKeys(ctx context.Context, req *pb.ListRequest, rsp *pb.ListResponse) error {
	// Check account
	acc, err := m3oauth.VerifyMicroCustomer(ctx, "v1.listkeys")
	if err != nil {
		return err
	}
	recs, err := listKeysForUser(acc.Issuer, acc.ID)
	if err != nil {
		log.Errorf("Error listing keys %s", err)
		return errors.InternalServerError("v1aapi.listkeys", "Error listing keys")
	}
	rsp.ApiKeys = make([]*pb.APIKey, len(recs))
	for i, apiRec := range recs {
		rsp.ApiKeys[i] = &pb.APIKey{
			Id:          apiRec.ID,
			Description: apiRec.Description,
			CreatedTime: apiRec.Created,
			Scopes:      apiRec.Scopes,
			LastSeen:    apiRec.LastSeen,
		}
	}
	return nil
}

func listKeysForUser(ns, userID string) ([]*apiKeyRecord, error) {
	recs, err := store.Read(fmt.Sprintf("%s:%s:%s:", storePrefixUserID, ns, userID), store.ReadPrefix())
	if err != nil {
		if err == store.ErrNotFound {
			return nil, nil
		}
		return nil, err
	}
	ret := make([]*apiKeyRecord, len(recs))
	for i, rec := range recs {
		apiRec := &apiKeyRecord{}
		if err := json.Unmarshal(rec.Value, apiRec); err != nil {
			return nil, err
		}
		ret[i] = apiRec
	}
	return ret, nil
}

func (v1 *V1) RevokeKey(ctx context.Context, request *pb.RevokeRequest, response *pb.RevokeResponse) error {
	if len(request.Id) == 0 {
		return errors.BadRequest("v1.Revoke", "Missing ID field")
	}
	acc, err := m3oauth.VerifyMicroCustomer(ctx, "v1.Revoke")
	if err != nil {
		return err
	}

	rec, err := readAPIRecordByKeyID(acc.Issuer, acc.ID, request.Id)
	if err != nil {
		if err == store.ErrNotFound {
			return errors.NotFound("v1.Revoke", "Not found")
		}
		log.Errorf("Error reading API key record %s", err)
		return errors.InternalServerError("v1pi.Revoke", "Error revoking key")
	}
	return v1.deleteKey(ctx, rec)
}

func (v1 *V1) deleteKey(ctx context.Context, rec *apiKeyRecord) error {
	if err := v1.deleteAPIRecord(ctx, rec); err != nil {
		log.Errorf("Error deleting API key record %s", err)
		return errors.InternalServerError("v1pi.Revoke", "Error revoking key")
	}

	_, err := v1.accsvc.Delete(ctx, &authpb.DeleteAccountRequest{
		Id: rec.AccID,
		Options: &authpb.Options{
			Namespace: rec.Namespace,
		},
	}, client.WithAuthToken())
	if err != nil {
		log.Errorf("Error deleting account for API key %s", err)
		return err
	}

	if err := events.Publish(eventspb.Topic, &eventspb.Event{
		Type: eventspb.EventType_EventTypeDeleteKey,
		Customer: &eventspb.Customer{
			Id: rec.UserID,
		},
		DeleteKey: &eventspb.DeleteKey{Id: rec.ID},
		ProjectId: rec.UserID,
	}); err != nil {
		log.Errorf("Error publishing event %s", err)
	}

	return nil
}

func (v1 *V1) BlockKey(ctx context.Context, request *pb.BlockKeyRequest, response *pb.BlockKeyResponse) error {
	if _, err := m3oauth.VerifyMicroAdmin(ctx, "v1.BlockKey"); err != nil {
		return err
	}
	if err := v1.updateKeyStatus(ctx, "v1.BlockKey", request.Namespace, request.UserId, request.KeyId, keyStatusBlocked, request.Message); err != nil {
		return err
	}
	if err := events.Publish(eventspb.Topic, &eventspb.Event{
		Type: eventspb.EventType_EventTypeBlockKey,
		Customer: &eventspb.Customer{
			Id: request.UserId,
		},
		BlockKey:  &eventspb.BlockKey{Id: request.KeyId},
		ProjectId: request.UserId,
	}); err != nil {
		log.Errorf("Error publishing event %s", err)
	}

	return nil
}

func (v1 *V1) UnblockKey(ctx context.Context, request *pb.UnblockKeyRequest, response *pb.UnblockKeyResponse) error {
	if _, err := m3oauth.VerifyMicroAdmin(ctx, "v1.UnblockKey"); err != nil {
		return err
	}
	if err := v1.updateKeyStatus(ctx, "v1.UnblockKey", request.Namespace, request.UserId, request.KeyId, keyStatusActive, ""); err != nil {
		return err
	}
	if err := events.Publish(eventspb.Topic, &eventspb.Event{
		Type: eventspb.EventType_EventTypeUnblockKey,
		Customer: &eventspb.Customer{
			Id: request.UserId,
		},
		UnblockKey: &eventspb.UnblockKey{Id: request.KeyId},
		ProjectId:  request.UserId,
	}); err != nil {
		log.Errorf("Error publishing event %s", err)
	}

	return nil
}

func (v1 *V1) updateKeyStatus(ctx context.Context, methodName, ns, userID, keyID string, status keyStatus, statusMessage string) error {

	var keys []*apiKeyRecord
	if len(keyID) > 0 {
		rec, err := readAPIRecordByKeyID(ns, userID, keyID)
		if err != nil {
			log.Errorf("Error reading key %s", err)
			if err == store.ErrNotFound {
				return errors.NotFound(methodName, "Not found")
			}
			return errors.InternalServerError(methodName, "Error updating key")
		}
		keys = []*apiKeyRecord{rec}
	} else {
		recs, err := listKeysForUser(ns, userID)
		if err != nil {
			log.Errorf("Error listing keys %s", err)
			return errors.InternalServerError(methodName, "Error updating key")
		}
		keys = recs
	}
	for _, k := range keys {
		k.Status = status
		k.StatusMessage = statusMessage
		if err := v1.writeAPIRecord(ctx, k); err != nil {
			log.Errorf("Error updating api key record %s", err)
			return errors.InternalServerError(methodName, "Error updating key")
		}
	}

	return nil
}
