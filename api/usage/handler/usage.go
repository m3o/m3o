package handler

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/errors"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	dbproto "m3o.dev/services/db/proto"
	custpb "m3o.dev/api/customers/proto"
	m3oauth "m3o.dev/api/pkg/auth"
	publicapipb "m3o.dev/api/publicapi/proto"
	pb "m3o.dev/api/usage/proto"
)

const (
	prefixCounter         = "usage-service/counter"
	prefixUsageByCustomer = "usageByCustomer" // customer ID / date
	counterTTL            = 48 * time.Hour
	counterMonthlyTTL     = 40 * 24 * time.Hour

	totalFree = "totalfree"
)

type UsageSvc struct {
	sync.RWMutex
	c               *counter
	dbService       dbproto.DbService
	custService     custpb.CustomersService
	papiService     publicapipb.PublicapiService
	rankCache       []*pb.APIRankItem
	globalRankCache []*pb.APIRankUserItem
	quotas          map[string]int64
	usageCaps       map[string]map[string]int64
}

func NewHandler(svc *service.Service, dbService dbproto.DbService) *UsageSvc {
	redisConfig := struct {
		Address  string
		User     string
		Password string
	}{}
	val, err := config.Get("micro.usage.redis")
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
	quotas := map[string]int64{}
	val, err = config.Get("micro.usage.quotas")
	if err != nil {
		log.Fatalf("No quota config found")
	}
	if err := val.Scan(&quotas); err != nil {
		log.Fatalf("Error parsing quota config %s", err)
	}

	usageCaps := map[string]map[string]int64{}
	val, err = config.Get("micro.usage.usage_caps")
	if err != nil {
		log.Fatalf("No usage cap config found")
	}
	if err := val.Scan(&usageCaps); err != nil {
		log.Fatalf("Error parsing usage caps config %s", err)
	}

	for tier, caps := range usageCaps {
		parsedCaps := map[string]int64{}
		for ep, val := range caps {
			// config service doesn't like keys with '.' in so endpoints stored as db$DB_Create rathre than db$Db.Create
			parsedCaps[strings.ReplaceAll(ep, "_", ".")] = val
		}
		usageCaps[tier] = parsedCaps
	}
	p := &UsageSvc{
		c:           &counter{redisClient: rc},
		dbService:   dbService,
		rankCache:   []*pb.APIRankItem{},
		custService: custpb.NewCustomersService("customers", svc.Client()),
		papiService: publicapipb.NewPublicapiService("publicapi", svc.Client()),
		quotas:      quotas,
		usageCaps:   usageCaps,
	}
	p.RankingCron()
	p.consumeEvents()
	return p
}

func (p *UsageSvc) Read(ctx context.Context, request *pb.ReadRequest, response *pb.ReadResponse) error {
	method := "usage.Read"
	errInternal := errors.InternalServerError(method, "Error retrieving usage")
	acc, ok := auth.AccountFromContext(ctx)
	if !ok {
		return errors.Unauthorized(method, "Unauthorized")
	}
	if len(request.CustomerId) == 0 {
		request.CustomerId = acc.ID
	}
	if acc.ID != request.CustomerId {
		_, err := m3oauth.VerifyMicroAdmin(ctx, method)
		if err != nil {
			return err
		}
	}

	now := time.Now().UTC().Truncate(24 * time.Hour)
	liveEntries, err := p.c.listForUser(request.CustomerId, now)
	if err != nil {
		log.Errorf("Error retrieving usage %s", err)
		return errInternal
	}

	response.Usage = map[string]*pb.UsageHistory{}
	// add live data on top of historical
	keyPrefix := fmt.Sprintf("%s/%s/", prefixUsageByCustomer, request.CustomerId)
	recs, err := store.Read(keyPrefix, store.ReadPrefix())
	if err != nil {
		log.Errorf("Error querying historical data %s", err)
		return errInternal
	}

	addEntryToResponse := func(response *pb.ReadResponse, e listEntry, unixTime int64) {
		// detailed view includes data for individual endpoints
		if !request.Detail && strings.Contains(e.Service, "$") {
			return
		}
		use := response.Usage[e.Service]
		if use == nil {
			use = &pb.UsageHistory{
				ApiName: e.Service,
				Records: []*pb.UsageRecord{},
			}
		}
		use.Records = append(use.Records, &pb.UsageRecord{Date: unixTime, Requests: e.Count})
		response.Usage[e.Service] = use
	}

	// add to slices
	for _, rec := range recs {
		date := strings.TrimPrefix(rec.Key, keyPrefix)
		if len(date) != 8 {
			continue
		}
		dateObj, err := time.Parse("20060102", date)
		if err != nil {
			log.Errorf("Error parsing date obj %s", err)
			return errInternal
		}
		var de dateEntry
		if err := json.Unmarshal(rec.Value, &de); err != nil {
			log.Errorf("Error parsing date obj %s", err)
			return errInternal
		}
		for _, e := range de.Entries {
			addEntryToResponse(response, e, dateObj.Unix())
		}
	}
	for _, e := range liveEntries {
		addEntryToResponse(response, e, now.Unix())
	}
	// sort slices
	for _, v := range response.Usage {
		sort.Slice(v.Records, func(i, j int) bool {
			if v.Records[i].Date == v.Records[j].Date {
				return v.Records[i].Requests < v.Records[j].Requests
			}
			return v.Records[i].Date < v.Records[j].Date
		})
	}
	// remove dupe
	for k, v := range response.Usage {
		lenRecs := len(v.Records)
		if lenRecs < 2 {
			continue
		}
		if v.Records[lenRecs-2].Date != v.Records[lenRecs-1].Date {
			continue
		}
		response.Usage[k].Records = append(v.Records[:lenRecs-2], v.Records[lenRecs-1])

	}

	count, err := p.c.readMonthly(ctx, request.CustomerId, totalFree, time.Now())
	if err != nil {
		log.Errorf("Error reading usage %s", err)
		return errors.InternalServerError(method, "Error reading usage")
	}

	qs, err := p.loadCustomerQuotas(request.CustomerId)
	if err != nil {
		log.Errorf("Error loading customer quotas %s", err)
		return errInternal
	}
	total, _ := qs.quota(totalFree)
	response.QuotaRemaining = total - count

	return nil
}

type dateEntry struct {
	Entries []listEntry
}

func (p *UsageSvc) UsageCron() {
	defer func() {
		log.Infof("Usage sweep ended")
	}()
	log.Infof("Performing usage sweep")
	// loop through counters and persist
	ctx := context.Background()
	sc := p.c.redisClient.Scan(ctx, 0, prefixCounter+":*", 0)
	if err := sc.Err(); err != nil {
		log.Errorf("Error running redis scan %s", err)
		return
	}

	toPersist := map[string]map[string][]listEntry{} // userid->date->[]listEntry
	it := sc.Iterator()
	for {
		if !it.Next(ctx) {
			if err := it.Err(); err != nil {
				log.Errorf("Error during iteration %s", err)
			}
			break
		}

		key := it.Val()
		count, err := p.c.redisClient.Get(ctx, key).Int64()
		if err != nil {
			log.Errorf("Error retrieving value %s", err)
			return
		}
		parts := strings.Split(strings.TrimPrefix(key, prefixCounter+":"), ":")
		if len(parts) < 3 {
			log.Errorf("Unexpected number of components in key %s", key)
			continue
		}
		userID := parts[0]
		date := parts[1]
		service := parts[2]
		dates := toPersist[userID]
		if dates == nil {
			dates = map[string][]listEntry{}
			toPersist[userID] = dates
		}
		entries := dates[date]
		if entries == nil {
			entries = []listEntry{}
		}
		entries = append(entries, listEntry{
			Service: service,
			Count:   count,
		})
		dates[date] = entries
	}

	for userID, v := range toPersist {
		for date, entry := range v {
			de := dateEntry{
				Entries: entry,
			}
			b, err := json.Marshal(de)
			if err != nil {
				log.Errorf("Error marshalling entry %s", err)
				return
			}
			store.Write(&store.Record{
				Key:   fmt.Sprintf("%s/%s/%s", prefixUsageByCustomer, userID, date),
				Value: b,
			})
		}

	}

}

func (p *UsageSvc) Sweep(ctx context.Context, request *pb.SweepRequest, response *pb.SweepResponse) error {
	p.UsageCron()
	return nil
}

func (p *UsageSvc) deleteUser(ctx context.Context, userID string) error {
	if err := p.c.deleteUser(ctx, userID); err != nil {
		return err
	}

	recs, err := store.Read(fmt.Sprintf("%s/%s/", prefixUsageByCustomer, userID), store.ReadPrefix())
	if err != nil {
		return err
	}
	for _, rec := range recs {
		if err := store.Delete(rec.Key); err != nil {
			return err
		}
	}

	if err := store.Delete(quotaByCustKey(userID)); err != nil {
		return err
	}
	return nil

}

func (p *UsageSvc) DeleteCustomer(ctx context.Context, request *pb.DeleteCustomerRequest, response *pb.DeleteCustomerResponse) error {
	if _, err := m3oauth.VerifyMicroAdmin(ctx, "usage.DeleteCustomer"); err != nil {
		return err
	}

	if len(request.Id) == 0 {
		return errors.BadRequest("usage.DeleteCustomer", "Error deleting customer")
	}

	if err := p.deleteUser(ctx, request.Id); err != nil {
		log.Errorf("Error deleting customer %s", err)
		return err
	}
	return nil
}

func (p *UsageSvc) SaveEvent(ctx context.Context, request *pb.SaveEventRequest, response *pb.SaveEventResponse) error {
	if request.Event == nil {
		return fmt.Errorf("event not provided")
	}
	if request.Event.Table == "" {
		return fmt.Errorf("table not provided")
	}
	rec := request.Event.Record.AsMap()
	if request.Event.Id == "" {
		request.Event.Id = uuid.New().String()
	}
	rec["id"] = request.Event.Id
	rec["createdAt"] = time.Now().Unix()
	bs, err := json.Marshal(rec)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bs, request.Event.Record)
	if err != nil {
		return err
	}
	_, err = p.dbService.Create(ctx, &dbproto.CreateRequest{
		Table:  request.Event.Table,
		Record: request.Event.Record,
	})
	return err
}

func (p *UsageSvc) ListEvents(ctx context.Context, request *pb.ListEventsRequest, response *pb.ListEventsResponse) error {
	if request.Table == "" {
		return fmt.Errorf("no table provided")
	}
	resp, err := p.dbService.Read(ctx, &dbproto.ReadRequest{
		Table:   request.Table,
		Query:   "createdAt > 0",
		OrderBy: "createdAt",
		Order:   "desc",
	})
	if err != nil {
		return err
	}
	for _, v := range resp.Records {
		response.Events = append(response.Events, &pb.Event{
			Table:  request.Table,
			Record: v,
		})
	}
	return nil
}

func (p *UsageSvc) ReadMonthlyTotal(ctx context.Context, request *pb.ReadMonthlyTotalRequest, response *pb.ReadMonthlyTotalResponse) error {
	acc, ok := auth.AccountFromContext(ctx)
	if !ok {
		return errors.Unauthorized("usage.ReadMonthlyTotal", "Unauthorized")
	}
	if len(request.CustomerId) == 0 {
		request.CustomerId = acc.ID
	}
	if acc.ID != request.CustomerId {
		_, err := m3oauth.VerifyMicroAdmin(ctx, "usage.ReadMonthlyTotal")
		if err != nil {
			return err
		}
	}

	count, err := p.c.readMonthly(ctx, request.CustomerId, "total", time.Now())
	if err != nil {
		log.Errorf("Error reading usage %s", err)
		return errors.InternalServerError("usage.ReadMonthlyTotal", "Error reading usage")
	}
	response.Requests = count

	if request.Detail {
		usage, err := p.c.listMonthliesForUser(request.CustomerId, time.Now())
		if err != nil {
			log.Errorf("Error reading usage %s", err)
			return errors.InternalServerError("usage.ReadMonthlyTotal", "Error reading usage")
		}
		ret := map[string]int64{}
		for _, le := range usage {
			ret[le.Service] = le.Count
		}
		response.EndpointRequests = ret
	}
	return nil
}

func (p *UsageSvc) ReadMonthly(ctx context.Context, request *pb.ReadMonthlyRequest, response *pb.ReadMonthlyResponse) error {
	method := "usage.ReadMonthly"
	_, err := m3oauth.VerifyMicroAdmin(ctx, method)
	if err != nil {
		return err
	}
	t := time.Now()
	response.Requests = map[string]int64{}
	response.Quotas = map[string]int64{}
	response.Caps = map[string]int64{}
	response.CapUsage = map[string]int64{}
	qs, err := p.loadCustomerQuotas(request.CustomerId)
	if err != nil {
		log.Errorf("Error loading customer quotas %s", err)
		return errors.InternalServerError(method, "Error reading usage")
	}
	for _, v := range request.Endpoints {
		split := strings.Split(v, "$")
		if len(split) == 2 {
			// get the tier caps
			caps := p.usageCaps[qs.Tier]
			if cap := caps[v]; cap > 0 {
				response.Caps[v] = cap
				response.CapUsage[v] = p.loadUnitUsage(ctx, request.CustomerId, split[0], split[1])
			}
		}

		count, err := p.c.readMonthly(ctx, request.CustomerId, v, t)
		if err != nil {
			log.Errorf("Error reading usage %s", err)
			return errors.InternalServerError(method, "Error reading usage")
		}
		response.Requests[v] = count
		if q, ok := qs.quota(v); ok {
			response.Quotas[v] = q
		}

	}
	return nil
}

type adminUsageRsp struct {
	Usage map[string]*adminUsageEntry `json:"usage"`
}

type adminUsageEntry struct {
	Usage string `json:"usage"`
	Units string `json:"units"`
}

// loadUnitUsage loads the recorded unit usage for the user for the endpoint e.g. how many rows does this user have in a DB or MB of storage used in S3
func (p *UsageSvc) loadUnitUsage(ctx context.Context, customerID, service, endpoint string) int64 {
	if service == totalFree || endpoint == totalFree {
		return 0
	}
	b, _ := json.Marshal(map[string]string{"tenant_id": "micro/" + customerID})
	request := client.DefaultClient.NewRequest(
		service,
		"Admin.Usage",
		json.RawMessage(b),
		client.WithContentType("application/json"),
	)

	var response adminUsageRsp
	// make the call
	if err := client.Call(ctx, request, &response, client.WithAuthToken()); err != nil {
		log.Errorf("Error reading usage %s", err)
	}
	entry := response.Usage[endpoint]
	if entry != nil {
		ret, _ := strconv.ParseInt(entry.Usage, 10, 64) // weirdness because usage comes back as string rather than int64
		return ret
	}
	return 0
}
