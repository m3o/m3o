package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/memegen/handler"
	pb "m3o.dev/services/memegen/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("memegen"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterMemegenHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
