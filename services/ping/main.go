package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"github.com/m3o/m3o/services/ping/handler"
	pb "github.com/m3o/m3o/services/ping/proto"
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
