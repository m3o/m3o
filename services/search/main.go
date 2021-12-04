package main

import (
	"github.com/m3o/m3o/services/search/handler"
	pb "github.com/m3o/m3o/services/search/proto"
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("search"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterSearchHandler(srv.Server(), new(handler.Search))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
