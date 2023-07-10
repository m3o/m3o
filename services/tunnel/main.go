package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/tunnel/handler"
	pb "m3o.dev/services/tunnel/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("tunnel"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterTunnelHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
