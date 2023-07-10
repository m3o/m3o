package handler

import (
	"encoding/json"
	"fmt"

	"m3o.dev/platform/service/store"
)

type Quotas struct {
	CustomerID string
	Tier       string // the currently held subscription tier for this customer

	// TODO add bundles here

	quotas map[string]int64 `json:"-"` // calculated dynamically in case of changes to amounts
}

func (q *Quotas) quota(endpoint string) (int64, bool) {
	quotaName := endpoint
	if quotaName == totalFree {
		quotaName = q.Tier
	}
	v, ok := q.quotas[quotaName]
	return v, ok
}

func (p *UsageSvc) switchTier(customerID, tier string) error {
	// find existing entry for user
	q, err := p.loadCustomerQuotas(customerID)
	if err != nil {
		return err
	}
	q.Tier = tier
	return store.Write(store.NewRecord(quotaByCustKey(customerID), q))
}

const (
	prefixQuotaByCustomer = `quotaByCust`
)

func quotaByCustKey(customerID string) string {
	return fmt.Sprintf("%s/%s", prefixQuotaByCustomer, customerID)
}

func (p *UsageSvc) loadCustomerQuotas(customerID string) (*Quotas, error) {
	mergeVals := func(quotas *Quotas) (*Quotas, error) {
		quotas.quotas = map[string]int64{quotas.Tier: p.quotas[quotas.Tier]}
		return quotas, nil
	}
	key := quotaByCustKey(customerID)
	recs, err := store.Read(key)
	if err != nil && err != store.ErrNotFound {
		return nil, err
	}
	if len(recs) == 0 {
		// no entry means they're on the free tier, let's lazily create one for them
		quot := &Quotas{
			CustomerID: customerID,
			Tier:       "free",
		}
		if err := store.Write(store.NewRecord(key, quot)); err != nil {
			return nil, err
		}
		return mergeVals(quot)
	}
	var quot Quotas
	if err := json.Unmarshal(recs[0].Value, &quot); err != nil {
		return nil, err
	}
	return mergeVals(&quot)

}
