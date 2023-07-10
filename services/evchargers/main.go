package main

import (
	"m3o.dev/services/evchargers/handler"
	pb "m3o.dev/services/evchargers/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("evchargers"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterEvchargersHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
