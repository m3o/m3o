package main

import (
	"m3o.dev/services/secret/handler"
	pb "m3o.dev/services/secret/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("secret"),
	)

	// Register handler
	pb.RegisterSecretHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
