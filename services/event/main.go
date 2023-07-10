package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/event/handler"
	pb "m3o.dev/services/event/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("event"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterEventHandler(srv.Server(), new(handler.Event))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
