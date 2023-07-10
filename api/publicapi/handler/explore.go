package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/errors"
	log "m3o.dev/platform/service/logger"
	model "m3o.dev/platform/service/model"
	"m3o.dev/platform/service/registry"
	"m3o.dev/platform/service/store"
	pb "m3o.dev/api/publicapi/proto"
)

type Explore struct {
	sync.RWMutex
	apiCache     []*API
	catCache     []string
	regCache     map[string]*registry.Service
	pricingCache []*pb.PricingItem
	lastUpdated  time.Time
	trackSearch  model.Model
}

type SearchCount struct {
	// search term itself
	Id    string `json:"id"`
	Count int64  `json:"count"`
}

// The API consisting of the public api def and the summary explore api info
type API struct {
	PublicAPI  *pb.PublicAPI
	ExploreAPI *pb.ExploreAPI
}

func marshalExploreAPI(ae *APIEntry, svc *registry.Service) *pb.ExploreAPI {
	eps := []*pb.Endpoint{}

	oaj := struct {
		Paths map[string]interface{} `json:"paths"`
	}{}

	if err := json.Unmarshal([]byte(ae.OpenAPIJSON), &oaj); err != nil {
		log.Errorf("Error unmarshalling open API json %s", err)
		oaj.Paths = map[string]interface{}{}
	}
	for _, ep := range svc.Endpoints {
		// hacks to stop certain endpoints not showing
		if _, ok := ep.Metadata["subscriber"]; ok {
			continue
		}
		path := "/" + svc.Name + "/" + strings.ReplaceAll(ep.Name, ".", "/")
		if _, ok := oaj.Paths[path]; !ok {
			continue
		}
		eps = append(eps, &pb.Endpoint{
			Name: ep.Name,
		})
	}

	return &pb.ExploreAPI{
		Name:        ae.Name,
		Description: ae.Description,
		Category:    ae.Category,
		Icon:        ae.Icon,
		Endpoints:   eps,
		DisplayName: ae.DisplayName,
	}
}

func NewExploreAPIHandler(srv *service.Service) *Explore {
	e := &Explore{
		trackSearch: model.New(SearchCount{}, &model.Options{
			Key: "id",
		}),
	}
	// start the cache
	go e.runCache()
	return e
}

func (e *Explore) runCache() {
	// force list/cache
	if _, err := e.loadCache(); err != nil {
		log.Error("Failed to write cache: %v", err)
	}

	t := time.NewTicker(time.Minute)

	for _ = range t.C {
		if _, err := e.loadCache(); err != nil {
			log.Error("Failed to write cache: %v", err)
		}
	}
}

func (e *Explore) loadCache() ([]*API, error) {
	// get the current list of services
	svcs, err := registry.ListServices()
	if err != nil {
		return nil, err
	}

	regCache := map[string]*registry.Service{}
	apiCache := []*API{}
	catCache := map[string]bool{}
	pricingCache := []*pb.PricingItem{}

	// create a registry cache
	for _, s := range svcs {
		regCache[s.Name] = s
	}

	// read api entries from the store
	recs, err := store.Read(fmt.Sprintf(prefixName, ""), store.ReadPrefix())
	if err != nil {
		log.Errorf("Error reading from store %s", err)
		return nil, err
	}

	for _, v := range recs {
		var ae APIEntry
		if err := json.Unmarshal(v.Value, &ae); err != nil {
			return nil, err
		}

		// check against the registry
		svc, ok := e.regCache[ae.Name]
		if !ok {
			continue
		}

		apiCache = append(apiCache, &API{
			PublicAPI:  marshal(&ae),
			ExploreAPI: marshalExploreAPI(&ae, svc),
		})
		catCache[ae.Category] = true

		price := &pb.PricingItem{
			Name:        ae.Name,
			Id:          ae.ID,
			Pricing:     ae.Pricing,
			DisplayName: ae.DisplayName,
			Icon:        ae.Icon,
			Quotas:      ae.Quotas,
		}
		if price.Pricing == nil {
			price.Pricing = map[string]int64{}
		}
		if price.Quotas == nil {
			price.Quotas = map[string]int64{}
		}

		// fill out all the endpoints
		for _, ep := range svc.Endpoints {
			if _, ok := price.Pricing[ep.Name]; !ok {
				price.Pricing[ep.Name] = 0
			}
			if _, ok := price.Quotas[ep.Name]; !ok {
				price.Quotas[ep.Name] = 0
			}
		}
		pricingCache = append(pricingCache, price)
	}

	catCacheSlice := make([]string, 0, len(catCache))
	for k, _ := range catCache {
		catCacheSlice = append(catCacheSlice, k)
	}

	e.Lock()
	e.regCache = regCache
	e.lastUpdated = time.Now()
	e.apiCache = apiCache
	e.catCache = catCacheSlice
	e.pricingCache = pricingCache
	e.Unlock()

	// return the api cache
	return apiCache, nil
}

// Index returns a summary description of all the apis
func (e *Explore) Index(ctx context.Context, request *pb.IndexRequest, response *pb.IndexResponse) error {
	apis, err := e.exploreList()
	if err != nil {
		return err
	}
	end := len(apis)

	if request.Limit > 0 {
		maxEnd := int(request.Limit + request.Offset)
		if maxEnd < end {
			end = maxEnd
		}
	}

	// offset surpasses the actual end of the slice
	if request.Offset > int64(end) {
		return nil
	}

	for _, api := range apis[request.Offset:end] {
		// return the explore api definition
		response.Apis = append(response.Apis, api.ExploreAPI)
	}

	return nil
}

func (e *Explore) exploreList() ([]*API, error) {
	e.RLock()
	cache := e.apiCache
	e.RUnlock()

	if len(cache) > 0 {
		return cache, nil
	}

	return e.loadCache()
}

func (e *Explore) recordSearch(searchTerm string) error {
	searchTerm = strings.ToLower(searchTerm)
	searchTerm = strings.Replace(searchTerm, " ", "-", -1)

	if searchTerm == "" {
		return fmt.Errorf("no search term to track")
	}
	oldTrack := []*SearchCount{}
	err := e.trackSearch.Read(model.QueryEquals("id", searchTerm), &oldTrack)
	if err != nil {
		return err
	}
	if len(oldTrack) == 0 {
		return e.trackSearch.Create(SearchCount{
			Id:    searchTerm,
			Count: 1,
		})
	}
	tr := oldTrack[0]
	tr.Count += 1
	return e.trackSearch.Update(tr)
}

// Search returns APIs based on the given search term
func (e *Explore) Search(ctx context.Context, request *pb.SearchRequest, response *pb.SearchResponse) error {
	go func() {
		if request.SearchTerm == "" {
			return
		}
		err := e.recordSearch(request.SearchTerm)
		if err != nil {
			log.Error(err)
		}
	}()
	list, err := e.exploreList()
	if err != nil {
		return err
	}

	matchedCat := func(cats []string, theCat string) bool {
		if len(cats) == 0 {
			return true // blank list matches everything
		}
		for _, cat := range cats {
			if cat == theCat {
				return true
			}
		}

		return false
	}

	theCats := request.Categories
	if len(request.Category) > 0 {
		theCats = append(theCats, request.Category)
	}

	if request.SearchTerm == "" {
		for _, api := range list {
			if matchedCat(theCats, api.ExploreAPI.Category) {
				response.Apis = append(response.Apis, api.ExploreAPI)
			}
		}
		return nil
	}

	// lowercase the search term
	request.SearchTerm = strings.ToLower(request.SearchTerm)

	// Very rudimentary search result ranking
	// prioritize name and endoint name matches
	matchedName := []*pb.ExploreAPI{}
	matchedEndpoint := []*pb.ExploreAPI{}
	matchedOther := []*pb.ExploreAPI{}

	for _, api := range list {
		if !matchedCat(theCats, api.ExploreAPI.Category) {
			continue
		}

		if strings.Contains(strings.ToLower(api.ExploreAPI.Name), request.SearchTerm) {
			matchedName = append(matchedName, api.ExploreAPI)
			continue
		}
		found := false
		for _, ep := range api.ExploreAPI.Endpoints {
			if strings.Contains(strings.ToLower(ep.Name), request.SearchTerm) {
				matchedEndpoint = append(matchedEndpoint, api.ExploreAPI)
				found = true
				break
			}
		}
		if found {
			continue
		}
		if strings.Contains(strings.ToLower(api.ExploreAPI.Description), request.SearchTerm) {
			matchedOther = append(matchedOther, api.ExploreAPI)
			continue
		}

	}
	response.Apis = append(response.Apis, matchedName...)
	response.Apis = append(response.Apis, matchedEndpoint...)
	response.Apis = append(response.Apis, matchedOther...)
	return nil
}

// API returns a single named API entry
func (e *Explore) API(ctx context.Context, request *pb.APIRequest, response *pb.APIResponse) error {
	if len(request.Name) == 0 {
		return errors.BadRequest("explore.API", "missing name")
	}

	list, err := e.exploreList()
	if err != nil {
		return err
	}

	// check the cache
	for _, api := range list {
		if api.ExploreAPI.Name == request.Name {
			response.Api = api.PublicAPI
			response.Summary = api.ExploreAPI
			return nil
		}
	}

	return errors.NotFound("explore.API", "not found")

}

func (e *Explore) ListCategories(ctx context.Context, request *pb.ListCategoriesRequest, response *pb.ListCategoriesResponse) error {
	var err error
	response.Categories, err = e.catList()
	if err != nil {
		return err
	}
	return nil
}

func (e *Explore) catList() ([]string, error) {
	e.RLock()
	cache := e.catCache
	e.RUnlock()

	if len(cache) > 0 {
		return cache, nil
	}

	if _, err := e.loadCache(); err != nil {
		return nil, err
	}
	e.RLock()
	cache = e.catCache
	e.RUnlock()
	return cache, nil
}

func (e *Explore) Pricing(ctx context.Context, request *pb.PricingRequest, response *pb.PricingResponse) error {
	var err error
	response.Prices, err = e.priceList()
	if err != nil {
		log.Errorf("Error retrieving pricing %s", err)
		return errors.InternalServerError("explore.pricing", "Error retrieving pricing")
	}
	return nil
}

func (e *Explore) priceList() ([]*pb.PricingItem, error) {
	e.RLock()
	cache := e.pricingCache
	e.RUnlock()

	if len(cache) > 0 {
		return cache, nil
	}

	if _, err := e.loadCache(); err != nil {
		return nil, err
	}
	e.RLock()
	cache = e.pricingCache
	e.RUnlock()
	return cache, nil
}
