package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/logger"
	balance "m3o.dev/api/balance/proto"
	billing "m3o.dev/api/billing/proto"
	publicapi "m3o.dev/api/publicapi/proto"
	usage "m3o.dev/api/usage/proto"
)

// publicapiCache caches the apis so we don't hit the publicapi for every call
type publicapiCache struct {
	sync.RWMutex
	apis map[string]*publicapi.PublicAPI
	papi publicapi.PublicapiService
}

func (p *publicapiCache) getPrice(api, endpoint string) int64 {
	p.RLock()
	defer p.RUnlock()
	return p.apis[strings.ToLower(api)].Pricing[strings.ToLower(endpoint)]
}

func (p *publicapiCache) getQuota(api, endpoint string) int64 {
	p.RLock()
	defer p.RUnlock()
	a := p.apis[strings.ToLower(api)]
	if a == nil {
		return 0
	}
	return a.Quotas[strings.ToLower(endpoint)]
}

func (p *publicapiCache) list() ([]*publicapi.PublicAPI, error) {
	rsp, err := p.papi.List(context.Background(), &publicapi.ListRequest{}, client.WithAuthToken())
	return rsp.Apis, err
}

func (p *publicapiCache) init() error {
	// load up the cache and periodically refresh
	load := func() error {
		rsp, err := p.papi.List(context.Background(), &publicapi.ListRequest{}, client.WithAuthToken())
		if err != nil {
			logger.Errorf("Failed to load publicapi pricing %s", err)
			return err
		}
		newMap := map[string]*publicapi.PublicAPI{}
		for _, api := range rsp.Apis {
			// normalise the maps for easier search
			for name, price := range api.Pricing {
				api.Pricing[strings.ToLower(name)] = price
			}
			for name, quota := range api.Quotas {
				api.Quotas[strings.ToLower(name)] = quota
			}
			newMap[strings.ToLower(api.Name)] = api
		}
		p.Lock()
		p.apis = newMap
		p.Unlock()

		return nil
	}
	if err := load(); err != nil {
		return err
	}
	go func() {
		for {
			time.Sleep(2 * time.Minute)
			load()
		}
	}()
	return nil

}

// balanceCache caches the calls to balance
type balanceCache struct {
	balsvc balance.BalanceService
}

func (b *balanceCache) getBalance(ctx context.Context, userID string) (int64, error) {
	// TODO caching
	rsp, err := b.balsvc.Current(ctx, &balance.CurrentRequest{
		CustomerId: userID,
	}, client.WithAuthToken())
	if err != nil {
		return 0, err
	}
	return rsp.CurrentBalance, nil
}

// expiringLRUCache caches the API key records for faster retrieval rather than hitting the DB for every call
type expiringLRUCache interface {
	Add(ctx context.Context, key string, value interface{}) error
	Remove(ctx context.Context, key string) error
	GetAPIKeyRecord(ctx context.Context, key string) (*apiKeyRecord, error)
}

type expiringRedisCache struct {
	redisClient *redis.Client
	ttl         time.Duration
}

func (c *expiringRedisCache) Add(ctx context.Context, key string, value interface{}) error {
	val, _ := json.Marshal(value)
	return c.redisClient.Set(ctx, fmt.Sprintf("%s:%s", keyCachePrefix, key), val, c.ttl).Err()
}

func (c *expiringRedisCache) Remove(ctx context.Context, key string) error {
	return c.redisClient.Del(ctx, fmt.Sprintf("%s:%s", keyCachePrefix, key)).Err()
}

func (c *expiringRedisCache) GetAPIKeyRecord(ctx context.Context, key string) (*apiKeyRecord, error) {
	b, err := c.redisClient.Get(ctx, fmt.Sprintf("%s:%s", keyCachePrefix, key)).Bytes()
	if err != nil {
		return nil, err
	}
	var keyRec apiKeyRecord
	if err := json.Unmarshal(b, &keyRec); err != nil {
		return nil, err
	}
	return &keyRec, nil
}

type usageCache struct {
	usagesvc usage.UsageService
}

func (u *usageCache) getMonthlyUsageTotal(ctx context.Context, userID string, api, endpoint string) (map[string]int64, map[string]int64, map[string]int64, map[string]int64, error) {
	rsp, err := u.usagesvc.ReadMonthly(ctx, &usage.ReadMonthlyRequest{
		CustomerId: userID,
		Endpoints:  []string{"totalfree", fmt.Sprintf("%s$%s", api, endpoint)},
	}, client.WithAuthToken())
	if err != nil {
		return nil, nil, nil, nil, err
	}
	return rsp.Requests, rsp.Quotas, rsp.Caps, rsp.CapUsage, nil
}

type tierCache struct {
	sync.RWMutex
	billingSvc billing.BillingService
	tiers      map[string]string
}

func (t *tierCache) getTier(ctx context.Context, userID string) (string, error) {
	t.RLock()
	tier, ok := t.tiers[userID]
	t.RUnlock()
	if ok {
		return tier, nil
	}
	return t.loadTier(ctx, userID)
}

func (t *tierCache) loadTier(ctx context.Context, userID string) (string, error) {
	rsp, err := t.billingSvc.ReadAccount(ctx, &billing.ReadAccountRequest{
		AdminId: userID,
	}, client.WithAuthToken())
	if err != nil {
		return "", err
	}
	t.Lock()
	t.tiers[userID] = rsp.BillingAccount.Subscriptions[0].Id
	defer t.Unlock()
	return t.tiers[userID], nil
}

func (t *tierCache) init() error {
	// load up the cache and periodically refresh
	load := func() error {
		ctx := context.Background()
		t.RLock()
		keys := make([]string, len(t.tiers))
		i := 0
		for k, _ := range t.tiers {
			keys[i] = k
			i++
		}
		t.RUnlock()
		for _, id := range keys {
			t.loadTier(ctx, id)
		}
		return nil
	}
	if err := load(); err != nil {
		return err
	}
	go func() {
		for {
			time.Sleep(10 * time.Minute)
			load()
		}
	}()
	return nil
}
