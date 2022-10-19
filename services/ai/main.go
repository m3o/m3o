package main

import (
	"m3o.dev/services/ai/handler"
	pb "m3o.dev/services/ai/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("ai"),
	)

	// Register handler
	pb.RegisterAiHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
