package main

import (
	"m3o.dev/services/sms/handler"
	pb "m3o.dev/services/sms/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("sms"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterSmsHandler(srv.Server(), new(handler.Sms))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
