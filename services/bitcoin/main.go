package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/bitcoin/handler"
	pb "m3o.dev/services/bitcoin/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("bitcoin"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterBitcoinHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
