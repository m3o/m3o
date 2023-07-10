package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/dns/handler"
	pb "m3o.dev/services/dns/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("dns"),
	)

	// Register handler
	pb.RegisterDnsHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
