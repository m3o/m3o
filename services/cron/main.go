package main

import (
	"m3o.dev/services/cron/handler"
	pb "m3o.dev/services/cron/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("cron"),
	)

	// Register handler
	pb.RegisterCronHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
