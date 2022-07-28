package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"github.com/m3o/m3o/services/tunnel/handler"
	pb "github.com/m3o/m3o/services/tunnel/proto"
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
