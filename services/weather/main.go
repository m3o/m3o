package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/weather/handler"
	pb "m3o.dev/services/weather/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("weather"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterWeatherHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
