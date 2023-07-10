package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/youtube/handler"
	pb "m3o.dev/services/youtube/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("youtube"),
		service.Version("latest"),
	)

	// Setup google maps
	c, err := config.Get("google.apikey")
	if err != nil {
		logger.Fatalf("Error loading config: %v", err)
	}
	apiKey := c.String("")
	if len(apiKey) == 0 {
		logger.Fatalf("Missing required config: google.apikey")
	}

	// Register handler
	pb.RegisterYoutubeHandler(srv.Server(), handler.New(apiKey))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
