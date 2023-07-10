package main

import (
	"m3o.dev/services/place/handler"
	pb "m3o.dev/services/place/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("place"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterPlaceHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
