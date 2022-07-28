package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"github.com/m3o/m3o/services/mq/handler"
	pb "github.com/m3o/m3o/services/mq/proto"
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
