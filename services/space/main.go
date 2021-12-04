package main

import (
	"github.com/m3o/m3o/services/space/handler"
	pb "github.com/m3o/m3o/services/space/proto"
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("space"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterSpaceHandler(srv.Server(), new(handler.Space))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
