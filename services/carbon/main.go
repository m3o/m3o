package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"github.com/m3o/m3o/services/carbon/handler"
	pb "github.com/m3o/m3o/services/carbon/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("carbon"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterCarbonHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
