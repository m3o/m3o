package handler

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/go-redis/redismock/v8"
	muclient "m3o.dev/platform/service/client"
	"m3o.dev/platform/service/errors"
	. "github.com/onsi/gomega"
	balance "m3o.dev/api/balance/proto"
	balancefake "m3o.dev/api/balance/proto/fakes"
	billing "m3o.dev/api/billing/proto"
	"m3o.dev/api/billing/proto/fakes"
	publicapi "m3o.dev/api/publicapi/proto"
	publicapifake "m3o.dev/api/publicapi/proto/fakes"
	usage "m3o.dev/api/usage/proto"
	usagefake "m3o.dev/api/usage/proto/fakes"
)

func TestCallVerification(t *testing.T) {

	tcs := []struct {
		key            *apiKeyRecord
		name           string
		err            error
		priceRet       string
		quota          int64
		price          int64
		reqCount       int64
		totalFreeCount int64
		balanceZero    bool
		ratelimit      bool
		tier           string
	}{
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"helloworld"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:     "free",
			err:      nil,
			priceRet: "free",
			quota:    0,
			reqCount: 0,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"helloworld"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:           "free monthly cap exceeded zero money",
			err:            errBlocked("Insufficient credit"),
			priceRet:       "",
			totalFreeCount: 1000000,
			balanceZero:    true,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"helloworld"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:           "free monthly cap exceeded fall back to money",
			totalFreeCount: 1000000,
			priceRet:       "1",
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"helloworld"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:     "free quota",
			err:      nil,
			priceRet: "0",
			quota:    1,
			price:    1,
			reqCount: 0,
		},
		{
			key: &apiKeyRecord{
				ID:            "id",
				ApiKey:        "apikey",
				Scopes:        []string{"helloworld"},
				UserID:        "userid",
				AccID:         "accid",
				Namespace:     "micro",
				Token:         "token",
				Status:        keyStatusBlocked,
				StatusMessage: "foobar",
			},
			name:     "free quota blocked key",
			err:      errBlocked("foobar"),
			priceRet: "",
			quota:    1,
			price:    1,
			reqCount: 0,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"helloworld"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:           "free quota monthly cap exceeded but paid for api quota",
			err:            nil,
			priceRet:       "0",
			quota:          1,
			price:          1,
			reqCount:       0,
			totalFreeCount: 1000000,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"helloworld"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:           "free quota monthly cap exceeded but paid for api",
			err:            nil,
			priceRet:       "1",
			price:          1,
			reqCount:       0,
			totalFreeCount: 1000000,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"foo"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:           "block no scope",
			err:            errBlocked("Insufficient privileges"),
			priceRet:       "",
			totalFreeCount: 1000000,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"*"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:     "Wildcard scope",
			err:      nil,
			priceRet: "free",
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"*"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:     "Insufficient credit",
			err:      errBlocked("Insufficient credit"),
			priceRet: "",
			price:    10000,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"*"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:     "Insufficient credit but still in quota",
			err:      nil,
			priceRet: "0",
			price:    10000,
			quota:    10,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"*"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:      "Rate limited",
			err:       errors.New("v1.blocked", "Too Many Requests", 429),
			ratelimit: true,
		},
		{
			key: &apiKeyRecord{
				ID:        "id",
				ApiKey:    "apikey",
				Scopes:    []string{"*"},
				UserID:    "userid",
				AccID:     "accid",
				Namespace: "micro",
				Token:     "token",
				Status:    keyStatusActive,
			},
			name:      "Not rate limited pro tier",
			priceRet:  "free",
			ratelimit: true,
			tier:      "pro",
		},
	}

	for _, tc := range tcs {
		t.Run(tc.name, func(t *testing.T) {
			g := NewWithT(t)
			fakepapi := publicapifake.FakePublicapiService{
				ListStub: func(ctx context.Context, request *publicapi.ListRequest, option ...muclient.CallOption) (*publicapi.ListResponse, error) {
					return &publicapi.ListResponse{Apis: []*publicapi.PublicAPI{
						{
							Id:      "helloworld",
							Name:    "helloworld",
							Pricing: map[string]int64{"Helloworld.Call": tc.price},
							Quotas:  map[string]int64{"Helloworld.Call": tc.quota},
						},
					}}, nil
				},
			}
			bal := int64(10)
			if tc.balanceZero {
				bal = 0
			}
			fakebalance := balancefake.FakeBalanceService{
				CurrentStub: func(ctx context.Context, request *balance.CurrentRequest, option ...muclient.CallOption) (*balance.CurrentResponse, error) {
					return &balance.CurrentResponse{CurrentBalance: bal}, nil
				},
			}

			fakeusage := usagefake.FakeUsageService{
				ReadMonthlyStub: func(ctx context.Context, request *usage.ReadMonthlyRequest, option ...muclient.CallOption) (*usage.ReadMonthlyResponse, error) {
					return &usage.ReadMonthlyResponse{
						Requests: map[string]int64{
							"helloworld$Helloworld.Call": tc.reqCount,
							"totalfree":                  tc.totalFreeCount,
						},
						Quotas: map[string]int64{
							"totalfree": 1000000,
						},
					}, nil
				},
			}
			tierID := "free"
			if len(tc.tier) > 0 {
				tierID = tc.tier
			}
			fakeBilling := fakes.FakeBillingService{
				ReadAccountStub: func(ctx context.Context, request *billing.ReadAccountRequest, option ...muclient.CallOption) (*billing.ReadAccountResponse, error) {
					return &billing.ReadAccountResponse{BillingAccount: &billing.BillingAccount{Subscriptions: []*billing.Subscription{{Id: tierID}}}}, nil
				},
			}

			var incrVal int64 = 1
			if tc.ratelimit {
				incrVal = 101
			}
			rc, rmock := redismock.NewClientMock()
			rmock.ExpectTxPipeline()
			rmock.Regexp().ExpectIncr(".*").SetVal(incrVal)
			rmock.Regexp().ExpectExpire(".*", 1*time.Second).SetVal(true)
			rmock.ExpectTxPipelineExec()

			v1api := &V1{
				publicapiCache: &publicapiCache{
					papi: &fakepapi,
				},
				balanceCache: &balanceCache{
					balsvc: &fakebalance,
				},
				usageCache: &usageCache{
					usagesvc: &fakeusage,
				},
				limiter: &limiter{c: rc},
				config: cfg{
					RateLimits: map[string]int64{
						"free": 100,
						"pro":  200,
					},
				},
				tierCache: &tierCache{
					tiers:      map[string]string{},
					billingSvc: &fakeBilling,
				},
			}
			v1api.publicapiCache.init()
			v1api.tierCache.init()

			pr, err := v1api.verifyCallAllowed(context.Background(), tc.key, "/v1/helloworld/Call")
			if tc.err == nil {
				g.Expect(err).To(BeNil())
			} else {
				g.Expect(err).To(Equal(tc.err))
			}
			g.Expect(pr).To(Equal(tc.priceRet))

		})
	}

}

type dummyCache struct {
	found bool
}

func (d dummyCache) Add(ctx context.Context, key string, value interface{}) error {
	return nil
}

func (d dummyCache) Remove(ctx context.Context, key string) error {
	return nil
}

func (d dummyCache) GetAPIKeyRecord(ctx context.Context, key string) (*apiKeyRecord, error) {
	if d.found {
		return &apiKeyRecord{ApiKey: key}, nil
	}
	return nil, fmt.Errorf("not found")
}

func TestReadAPIRecordsByKey(t *testing.T) {
	tcs := []struct {
		name    string
		authHdr string
		key     string
		found   bool
		err     error
	}{
		{
			name:    "Base case",
			authHdr: "Bearer 12345",
			key:     "12345",
			found:   true,
			err:     nil,
		},
		{
			name:    "Base case not found",
			authHdr: "Bearer 12345",
			key:     "",
			found:   false,
			err:     errUnauthorized,
		},
		{
			name:    "Basic auth case",
			authHdr: "Basic Zm9vOmJhcg==",
			key:     "bar",
			found:   true,
			err:     nil,
		},
		{
			name:    "Basic auth case not found",
			authHdr: "Bearer Zm9vOmJhcg==",
			key:     "",
			found:   false,
			err:     errUnauthorized,
		},
		{
			name:    "Bad format header",
			authHdr: "Foobar baz",
			key:     "",
			found:   false,
			err:     errUnauthorized,
		},
	}

	for _, tc := range tcs {
		t.Run(tc.name, func(t *testing.T) {
			g := NewWithT(t)
			v1 := V1{
				keyRecCache: &dummyCache{
					found: tc.found,
				},
			}
			key, rec, err := v1.readAPIRecordByAPIKey(context.Background(), tc.authHdr)
			if tc.err != nil {
				g.Expect(err).To(Equal(err))
			} else {
				g.Expect(err).To(BeNil())
				g.Expect(key).To(Equal(tc.key))
				g.Expect(rec).ToNot(BeNil())
			}
		})
	}
}
