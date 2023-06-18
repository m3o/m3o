package main

import (
	"m3o.dev/services/news/handler"
	pb "m3o.dev/services/news/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/config"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("news"),
		service.Version("latest"),
	)

	// Setup google maps
	c, err := config.Get("news.apikey")
	if err != nil {
		logger.Fatalf("Error loading config: %v", err)
	}

	apiKey := c.String("")
	if len(apiKey) == 0 {
		logger.Fatalf("Missing required config: news.apikey")
	}

	// Register handler
	pb.RegisterNewsHandler(srv.Server(), handler.New(apiKey))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
