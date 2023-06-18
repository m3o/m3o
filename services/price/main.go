package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/price/handler"
	pb "m3o.dev/services/price/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("price"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterPriceHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
