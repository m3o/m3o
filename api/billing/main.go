package main

import (
	"m3o.dev/api/billing/handler"
	pb "m3o.dev/api/billing/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("billing"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterBillingHandler(srv.Server(), handler.New(srv))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
