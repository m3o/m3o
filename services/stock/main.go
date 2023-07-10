package main

import (
	"time"

	"m3o.dev/services/stock/handler"
	pb "m3o.dev/services/stock/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/logger"
	"github.com/patrickmn/go-cache"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("stock"),
		service.Version("latest"),
	)

	v, err := config.Get("finage.api")
	if err != nil {
		logger.Fatalf("finage.api config not found: %v", err)
	}
	api := v.String("")
	if len(api) == 0 {
		logger.Fatal("finage.api config not found")
	}
	v, err = config.Get("finage.key")
	if err != nil {
		logger.Fatalf("finage.key config not found: %v", err)
	}
	key := v.String("")
	if len(key) == 0 {
		logger.Fatal("finage.key config not found")
	}

	// Register handler
	pb.RegisterStockHandler(srv.Server(), &handler.Stock{
		Api:   api,
		Key:   key,
		Cache: cache.New(5*time.Minute, 10*time.Minute),
	})

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
