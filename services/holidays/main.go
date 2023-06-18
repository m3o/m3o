package main

import (
	"m3o.dev/services/holidays/handler"
	pb "m3o.dev/services/holidays/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("holidays"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterHolidaysHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
