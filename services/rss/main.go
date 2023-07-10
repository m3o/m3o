package main

import (
	"time"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	admin "m3o.dev/services/pkg/service/proto"

	"m3o.dev/services/pkg/tracing"
	"m3o.dev/services/rss/handler"
	pb "m3o.dev/services/rss/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("rss"),
	)

	st := store.DefaultStore
	crawl := handler.NewCrawl(st)
	rss := handler.NewRss(st, crawl)

	// crawl
	go func() {
		crawl.FetchAll()
		tick := time.NewTicker(1 * time.Minute)
		for _ = range tick.C {
			crawl.FetchAll()
		}
	}()

	// Register handler
	pb.RegisterRssHandler(srv.Server(), rss)
	admin.RegisterAdminHandler(srv.Server(), rss)
	traceCloser := tracing.SetupOpentracing("rss")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
