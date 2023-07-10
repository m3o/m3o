package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/ethereum/handler"
	pb "m3o.dev/services/ethereum/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("ethereum"),
	)

	// Register handler
	pb.RegisterEthereumHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
