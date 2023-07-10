package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/stream/handler"
	pb "m3o.dev/services/stream/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("stream"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterStreamHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
