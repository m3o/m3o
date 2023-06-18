package main

import (
	"m3o.dev/services/quran/handler"
	pb "m3o.dev/services/quran/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("quran"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterQuranHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
