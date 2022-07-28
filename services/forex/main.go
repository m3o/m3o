package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"github.com/m3o/m3o/services/forex/handler"
	pb "github.com/m3o/m3o/services/forex/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("forex"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterForexHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
