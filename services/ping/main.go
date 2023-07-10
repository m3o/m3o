package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/ping/handler"
	pb "m3o.dev/services/ping/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("ping"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterPingHandler(srv.Server(), new(handler.Ping))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
