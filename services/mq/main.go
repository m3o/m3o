package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/mq/handler"
	pb "m3o.dev/services/mq/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("mq"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterMqHandler(srv.Server(), new(handler.Mq))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
