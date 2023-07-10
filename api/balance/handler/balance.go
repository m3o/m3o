package handler

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"sort"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/errors"
	"m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	pb "m3o.dev/api/balance/proto"
	m3oauth "m3o.dev/api/pkg/auth"
	eventspb "m3o.dev/api/pkg/events/proto/customers"
	publicapi "m3o.dev/api/publicapi/proto"
	stripe "m3o.dev/api/stripe/proto"
)

const (
	prefixCounter         = "balance-service/counter"
	prefixStoreByCustomer = "adjByCust"
)

type counter struct {
	sync.RWMutex
	redisClient *redis.Client
}

func (c *counter) incr(ctx context.Context, userID, path string, delta int64) (int64, error) {
	return c.redisClient.IncrBy(ctx, fmt.Sprintf("%s:%s:%s", prefixCounter, userID, path), delta).Result()
}

func (c *counter) decr(ctx context.Context, userID, path string, delta int64) (int64, error) {
	return c.redisClient.DecrBy(ctx, fmt.Sprintf("%s:%s:%s", prefixCounter, userID, path), delta).Result()
}

func (c *counter) read(ctx context.Context, userID, path string) (int64, error) {
	ret, err := c.redisClient.Get(ctx, fmt.Sprintf("%s:%s:%s", prefixCounter, userID, path)).Int64()
	if err == redis.Nil {
		return 0, nil
	}
	return ret, err
}

func (c *counter) reset(ctx context.Context, userID, path string) error {
	return c.redisClient.Set(ctx, fmt.Sprintf("%s:%s:%s", prefixCounter, userID, path), 0, 0).Err()
}

func (c *counter) deleteUser(ctx context.Context, userID string) error {
	keys, err := c.redisClient.Keys(ctx, fmt.Sprintf("%s:%s:*", prefixCounter, userID)).Result()
	if err != nil {
		if err == redis.Nil {
			return nil
		}
		return err
	}
	if len(keys) == 0 {
		return nil
	}
	if err := c.redisClient.Del(ctx, keys...).Err(); err != nil && err != redis.Nil {
		return err
	}

	return nil
}

type publicAPICacheEntry struct {
	api     *publicapi.PublicAPI
	created time.Time
}

// Adjustment represents a balance adjustment (not including normal API usage). e.g. credit being added, promo codes, manual adjustment for customer service etc
type Adjustment struct {
	ID         string
	Created    time.Time
	Amount     int64  // positive is credit, negative is debit
	Reference  string // reference description
	Visible    bool   // should this be visible to the customer? If false, it only displays to admins
	CustomerID string
	ActionedBy string // who made the adjustment
	Meta       map[string]string
}

type Balance struct {
	c         *counter // counts the balance. Balance is expressed in 1/10,000ths of a cent which allows us to price in fractions e.g. a request costs 0.0001 cents or 10,000 requests for 1 cent
	stripeSvc stripe.StripeService
	margin    float64

	// for balance transfers
	mtx sync.Mutex
}

func NewHandler(svc *service.Service) *Balance {
	redisConfig := struct {
		Address  string
		User     string
		Password string
	}{}
	val, err := config.Get("micro.balance.redis")
	if err != nil {
		log.Fatalf("No redis config found %s", err)
	}
	if err := val.Scan(&redisConfig); err != nil {
		log.Fatalf("Error parsing redis config %s", err)
	}
	if len(redisConfig.Password) == 0 || len(redisConfig.User) == 0 || len(redisConfig.Password) == 0 {
		log.Fatalf("Missing redis config %s", err)
	}
	rc := redis.NewClient(&redis.Options{
		Addr:     redisConfig.Address,
		Username: redisConfig.User,
		Password: redisConfig.Password,
		TLSConfig: &tls.Config{
			InsecureSkipVerify: false,
		},
	})
	mval, err := config.Get("micro.balance.margin")
	if err != nil {
		log.Fatalf("No margin config found")
	}

	b := &Balance{
		c:         &counter{redisClient: rc},
		stripeSvc: stripe.NewStripeService("stripe", svc.Client()),
		margin:    mval.Float64(0.5),
	}
	go b.consumeEvents()
	return b
}

func (b *Balance) Transfer(ctx context.Context, req *pb.TransferRequest, rsp *pb.TransferResponse) error {
	b.mtx.Lock()
	defer b.mtx.Unlock()

	// increment counter
	acc, err := m3oauth.VerifyMicroAdmin(ctx, "balance.transfer")
	if err != nil {
		return err
	}

	if len(req.FromId) == 0 || len(req.ToId) == 0 {
		return errors.BadRequest("balance.transfer", "missing ids")
	}

	amount, err := b.c.read(ctx, req.FromId, "$balance$")
	if amount < req.Amount {
		return errors.BadRequest("balance.transfer", "insufficient balance")
	}

	_, err = b.c.decr(ctx, req.FromId, "$balance$", req.Amount)
	if err != nil {
		return err
	}

	_, err = storeAdjustment(acc.ID, -req.Amount, req.FromId, req.Reference, req.Visible, nil)
	if err != nil {
		return err
	}

	_, err = b.c.incr(ctx, req.ToId, "$balance$", req.Amount)
	if err != nil {
		return err
	}

	_, err = storeAdjustment(acc.ID, req.Amount, req.ToId, req.Reference, req.Visible, nil)
	if err != nil {
		return err
	}

	return nil
}

func (b Balance) Increment(ctx context.Context, request *pb.IncrementRequest, response *pb.IncrementResponse) error {
	// increment counter
	acc, err := m3oauth.VerifyMicroAdmin(ctx, "balance.Increment")
	if err != nil {
		return err
	}
	if len(request.Reference) == 0 {
		return errors.BadRequest("balance.Increment", "Missing reference")
	}

	// TODO idempotency
	// increment the balance
	currBal, err := b.c.incr(ctx, request.CustomerId, "$balance$", request.Delta)
	if err != nil {
		return err
	}
	response.NewBalance = currBal
	adj, err := storeAdjustment(acc.ID, request.Delta, request.CustomerId, request.Reference, request.Visible, nil)
	if err != nil {
		return err
	}

	evt := &eventspb.Event{
		Type:     eventspb.EventType_EventTypeBalanceIncrement,
		Customer: &eventspb.Customer{Id: adj.CustomerID},
		BalanceIncrement: &eventspb.BalanceIncrement{
			Amount:    adj.Amount,
			Type:      "system",
			Reference: adj.Reference,
		},
		ProjectId: adj.CustomerID,
	}
	if err := events.Publish(eventspb.Topic, evt); err != nil {
		logger.Errorf("Error publishing event %+v", evt)
	}

	if currBal < 0 {
		return nil
	}

	return nil
}

func storeAdjustment(actionedBy string, delta int64, customerID, reference string, visible bool, meta map[string]string) (*Adjustment, error) {

	// record it
	rec := &Adjustment{
		ID:         uuid.New().String(),
		Created:    time.Now(),
		Amount:     delta,
		Reference:  reference,
		Visible:    visible,
		CustomerID: customerID,
		ActionedBy: actionedBy,
		Meta:       meta,
	}
	adj, err := json.Marshal(rec)
	if err != nil {
		return nil, err
	}

	if err := store.Write(&store.Record{
		Key:   fmt.Sprintf("%s/%s/%s", prefixStoreByCustomer, customerID, rec.ID),
		Value: adj,
	}); err != nil {
		return nil, err
	}
	return rec, nil
}

func (b *Balance) Decrement(ctx context.Context, request *pb.DecrementRequest, response *pb.DecrementResponse) error {
	acc, err := m3oauth.VerifyMicroAdmin(ctx, "balance.Decrement")
	if err != nil {
		return err
	}
	if len(request.Reference) == 0 {
		return errors.BadRequest("balance.Decrement", "Missing reference")
	}
	// TODO idempotency
	// decrement the balance
	currBal, err := b.c.decr(ctx, request.CustomerId, "$balance$", request.Delta)
	if err != nil {
		return err
	}

	response.NewBalance = currBal
	adj, err := storeAdjustment(acc.ID, -request.Delta, request.CustomerId, request.Reference, request.Visible, nil)
	if err != nil {
		return err
	}

	evt := &eventspb.Event{
		Type: eventspb.EventType_EventTypeBalanceDecrement,
		BalanceDecrement: &eventspb.BalanceDecrement{
			Amount:    adj.Amount,
			Type:      "system",
			Reference: adj.Reference,
		},
		Customer:  &eventspb.Customer{Id: adj.CustomerID},
		ProjectId: request.CustomerId,
	}
	if err := events.Publish(eventspb.Topic, evt); err != nil {
		logger.Errorf("Error publishing event %+v", evt)
	}

	if currBal > 0 {
		return nil
	}
	evt = &eventspb.Event{
		Type:      eventspb.EventType_EventTypeBalanceZero,
		Customer:  &eventspb.Customer{Id: adj.CustomerID},
		ProjectId: adj.CustomerID,
	}
	if err := events.Publish(eventspb.Topic, &evt); err != nil {
		logger.Errorf("Error publishing event %+v", evt)
	}

	return nil
}

func (b *Balance) Current(ctx context.Context, request *pb.CurrentRequest, response *pb.CurrentResponse) error {
	acc, err := m3oauth.VerifyMicroCustomer(ctx, "balance.Current")
	if err != nil {
		return err
	}
	if len(request.CustomerId) == 0 {
		request.CustomerId = acc.ID
	}
	if acc.ID != request.CustomerId {
		// is this an admin?
		if _, err := m3oauth.VerifyMicroAdmin(ctx, "balance.Current"); err != nil {
			return err
		}
	}
	currBal, err := b.c.read(ctx, request.CustomerId, "$balance$")
	if err != nil && err != redis.Nil {
		log.Errorf("Error reading from counter %s", err)
		return errors.InternalServerError("balance.Current", "Error retrieving current balance")
	}
	response.CurrentBalance = currBal
	return nil
}

func (b *Balance) ListAdjustments(ctx context.Context, request *pb.ListAdjustmentsRequest, response *pb.ListAdjustmentsResponse) error {
	acc, err := m3oauth.VerifyMicroCustomer(ctx, "balance.ListAdjustments")
	if err != nil {
		// TODO check for micro admin
		return err
	}
	recs, err := store.Read(fmt.Sprintf("%s/%s/", prefixStoreByCustomer, acc.ID), store.ReadPrefix())
	if err != nil {
		return err
	}

	ret := []*pb.Adjustment{}
	for _, rec := range recs {
		var adj Adjustment
		if err := json.Unmarshal(rec.Value, &adj); err != nil {
			return err
		}
		if !adj.Visible {
			continue
		}
		ret = append(ret, &pb.Adjustment{
			Id:        adj.ID,
			Created:   adj.Created.Unix(),
			Delta:     adj.Amount,
			Reference: adj.Reference,
			Meta:      adj.Meta,
		})
	}
	sort.Slice(ret, func(i, j int) bool {
		return ret[i].Created < ret[j].Created
	})
	response.Adjustments = ret
	return nil
}

func (b *Balance) deleteCustomer(ctx context.Context, userID string) error {
	if err := b.c.deleteUser(ctx, userID); err != nil {
		return err
	}
	recs, err := store.Read(fmt.Sprintf("%s/%s/", prefixStoreByCustomer, userID), store.ReadPrefix())
	if err != nil {
		return err
	}
	for _, rec := range recs {
		if err := store.Delete(rec.Key); err != nil {
			return err
		}
	}
	return nil

}

func (b *Balance) DeleteCustomer(ctx context.Context, request *pb.DeleteCustomerRequest, response *pb.DeleteCustomerResponse) error {
	if _, err := m3oauth.VerifyMicroAdmin(ctx, "balance.DeleteCustomer"); err != nil {
		return err
	}
	if len(request.UserId) == 0 {
		return errors.BadRequest("balance.DeleteCustomer", "Missing user ID")
	}

	if err := b.deleteCustomer(ctx, request.UserId); err != nil {
		logger.Errorf("Error deleting customer %s", err)
		return err
	}
	return nil
}
