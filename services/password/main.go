package main

import (
	"github.com/m3o/m3o/services/password/handler"
	pb "github.com/m3o/m3o/services/password/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("password"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterPasswordHandler(srv.Server(), new(handler.Password))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
