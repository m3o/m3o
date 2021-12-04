package main

import (
	"github.com/m3o/m3o/services/quran/handler"
	pb "github.com/m3o/m3o/services/quran/proto"

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
	pb.RegisterQuranHandler(srv.Server(), new(handler.Quran))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
