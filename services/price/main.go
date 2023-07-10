package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
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
