package main

import (
	"m3o.dev/services/secret/handler"
	pb "m3o.dev/services/secret/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
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
