package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	"m3o.dev/platform/service/client"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	custpb "m3o.dev/api/customers/proto"
	publicapipb "m3o.dev/api/publicapi/proto"
	pb "m3o.dev/api/usage/proto"
)

// ListAPIRanks returns the ranking of the APIs based on data up to but not including today.
// We calculate the "popularity" (a score 0-10) based on how many requests an API has compared to the "top" performing API.
// Note: the top performing API is found after removing any APIs with zscore above 1.5 (i.e. outside of 1.5 standard deviations)
func (p *UsageSvc) ListAPIRanks(ctx context.Context, request *pb.ListAPIRanksRequest, response *pb.ListAPIRanksResponse) error {
	p.RLock()
	defer p.RUnlock()
	response.Ranks = p.rankCache
	response.GlobalTopUsers = p.globalRankCache
	return nil
}

func (p *UsageSvc) RankingCron() {
	// construct ranks
	keyPrefix := fmt.Sprintf("%s/%s/", prefixUsageByCustomer, totalID)
	recs, err := store.Read(keyPrefix, store.ReadPrefix())
	if err != nil {
		log.Errorf("Error querying historical data %s", err)
		return
	}

	type entry struct {
		requestCount int64
		apiName      string
	}

	runningTotals := map[string]*entry{}

	thirtyDays := time.Now().Add(-30 * 24 * time.Hour)
	// add to slices
	for _, rec := range recs {
		date := strings.TrimPrefix(rec.Key, keyPrefix)
		dateObj, err := time.Parse("20060102", date)
		if err != nil {
			log.Errorf("Error parsing date obj %s", err)
			return
		}
		if dateObj.Before(thirtyDays) {
			continue
		}
		var de dateEntry
		if err := json.Unmarshal(rec.Value, &de); err != nil {
			log.Errorf("Error parsing date obj %s", err)
			return
		}

		for _, e := range de.Entries {
			if strings.Contains(e.Service, "$") {
				continue
			}
			en := runningTotals[e.Service]
			if en == nil {
				en = &entry{apiName: e.Service}
			}
			en.requestCount += e.Count
			runningTotals[e.Service] = en
		}
	}

	sortSlice := []*entry{}
	reqTotal := int64(0)
	for _, v := range runningTotals {
		sortSlice = append(sortSlice, v)
		reqTotal += v.requestCount
	}
	mean := float64(reqTotal) / float64(len(sortSlice))
	sort.Slice(sortSlice, func(i, j int) bool {
		return sortSlice[i].requestCount > sortSlice[j].requestCount
	})

	sd := float64(0)
	for _, v := range sortSlice {
		sd += math.Pow(float64(v.requestCount)-mean, 2)
	}
	sd = math.Sqrt(sd / float64(len(sortSlice)))

	maxReqs := sortSlice[0].requestCount
	// find highest request count with zscore within 3
	for _, v := range sortSlice {
		zscore := (float64(v.requestCount) - mean) / sd
		if zscore <= 1.5 {
			maxReqs = v.requestCount
			break
		}
	}

	retSlice := []*pb.APIRankItem{}

	calcPopularity := func(requestCount int64) int32 {
		ret := int32(math.Round(float64(requestCount) / float64(maxReqs) * 10))
		if ret > 10 {
			return 10
		}
		return ret
	}
	top10s, globalTop10, err := p.calcTop10s()
	if err != nil {
		return
	}

	prsp, err := p.papiService.List(context.Background(), &publicapipb.ListRequest{}, client.WithAuthToken())
	if err != nil {
		log.Errorf("Error retrieving publicapi list %s", err)
		return
	}
	displayNames := map[string]string{}
	for _, api := range prsp.Apis {
		displayNames[api.Name] = api.DisplayName
	}

	for i, v := range sortSlice {
		retSlice = append(retSlice, &pb.APIRankItem{
			ApiName:        v.apiName,
			Position:       int32(i + 1),
			TopUsers:       top10s[v.apiName],
			Popularity:     calcPopularity(v.requestCount),
			ApiDisplayName: displayNames[v.apiName],
		})
	}

	p.Lock()
	p.rankCache = retSlice
	p.globalRankCache = globalTop10
	p.Unlock()
}

func (p *UsageSvc) calcTop10s() (map[string][]*pb.APIRankUserItem, []*pb.APIRankUserItem, error) {
	// construct ranks
	keyPrefix := fmt.Sprintf("%s/", prefixUsageByCustomer)
	recs, err := store.Read(keyPrefix, store.ReadPrefix())
	if err != nil {
		log.Errorf("Error querying historical data %s", err)
		return nil, nil, err
	}

	type userEntry struct {
		id          string
		apiRequests map[string]int64
	}
	users := map[string]*userEntry{} // userID to entry

	type top10User struct {
		id    string
		count int64
	}
	type entry struct {
		top10 []*top10User
	}

	runningTotals := map[string]*entry{}

	thirtyDays := time.Now().Add(-30 * 24 * time.Hour)

	// load up the user counts
	for _, rec := range recs {
		split := strings.Split(rec.Key, "/")
		userID := split[1]
		if userID == totalID {
			// skip the "total" user ID
			continue
		}
		date := strings.TrimPrefix(rec.Key, fmt.Sprintf("%s/%s/", prefixUsageByCustomer, userID))
		if len(date) != 8 {
			// skip anything that isn't a daily total
			continue
		}
		dateObj, err := time.Parse("20060102", date)
		if err != nil {
			log.Errorf("Error parsing date obj %s", err)
			return nil, nil, err
		}
		if dateObj.Before(thirtyDays) {
			continue
		}
		var de dateEntry
		if err := json.Unmarshal(rec.Value, &de); err != nil {
			log.Errorf("Error parsing record %s", err)
			return nil, nil, err
		}
		ue := users[userID]
		if ue == nil {
			ue = &userEntry{
				id:          userID,
				apiRequests: map[string]int64{},
			}
		}

		for _, e := range de.Entries {
			if strings.Contains(e.Service, "$") {
				// skip the endpoint breakdown
				continue
			}
			ue.apiRequests[e.Service] += e.Count
		}
		users[userID] = ue
	}

	globalTopUsers := []*top10User{}
	// calc the top 10s
	for _, user := range users {
		userTotal := int64(0)
		for svc, count := range user.apiRequests {
			userTotal += count
			en := runningTotals[svc]
			userEntry := &top10User{
				id:    user.id,
				count: count,
			}
			if en == nil {
				en = &entry{
					top10: []*top10User{userEntry},
				}
			} else {
				en.top10 = append(en.top10, userEntry)
				sort.Slice(en.top10, func(i, j int) bool {
					return en.top10[i].count > en.top10[j].count
				})
				if len(en.top10) > 10 {
					en.top10 = en.top10[:10]
				}
			}
			runningTotals[svc] = en
		}
		globalTopUsers = append(globalTopUsers, &top10User{
			id:    user.id,
			count: userTotal,
		})
		sort.Slice(globalTopUsers, func(i, j int) bool {
			return globalTopUsers[i].count > globalTopUsers[j].count
		})
		if len(globalTopUsers) > 10 {
			globalTopUsers = globalTopUsers[:10]
		}
	}

	ret := map[string][]*pb.APIRankUserItem{}
	custIDToName := map[string]string{}
	for svc, v := range runningTotals {
		log.Infof("Top 10 %s", svc)
		top := []*pb.APIRankUserItem{}
		for i, s := range v.top10 {
			log.Infof("%+v", s)
			name, err := p.getUserName(context.Background(), s.id, custIDToName)
			if err != nil {
				return nil, nil, err
			}
			top = append(top, &pb.APIRankUserItem{
				UserName: name,
				Position: int32(i + 1),
			})
		}
		ret[svc] = top
	}

	retGlobal := []*pb.APIRankUserItem{}
	log.Infof("Global top 10")
	for i, v := range globalTopUsers {
		log.Infof("%+v", v)
		name, err := p.getUserName(context.Background(), v.id, custIDToName)
		if err != nil {
			return nil, nil, err
		}
		retGlobal = append(retGlobal, &pb.APIRankUserItem{Position: int32(i + 1), UserName: name})
	}
	return ret, retGlobal, nil
}

func (p *UsageSvc) getUserName(ctx context.Context, id string, cache map[string]string) (string, error) {
	name := cache[id]
	if len(name) == 0 {
		rsp, err := p.custService.Read(ctx, &custpb.ReadRequest{Id: id}, client.WithAuthToken())
		if err != nil {
			if !strings.Contains(err.Error(), "not found") {
				log.Errorf("Error reading customer %s %s", id, err)
				return "", err
			}
			name = "Anonymous"
		} else {
			name = rsp.Customer.Name
			if len(name) == 0 {
				name = rsp.Customer.Meta["generated_name"]
			}
		}
		cache[id] = name
	}
	return name, nil
}
