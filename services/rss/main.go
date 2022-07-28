package main

import (
	"time"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"github.com/micro/micro/v3/service/store"
	admin "github.com/m3o/m3o/services/pkg/service/proto"

	"github.com/m3o/m3o/services/pkg/tracing"
	"github.com/m3o/m3o/services/rss/handler"
	pb "github.com/m3o/m3o/services/rss/proto"
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
