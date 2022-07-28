package main

import (
	"github.com/m3o/m3o/services/movie/handler"
	pb "github.com/m3o/m3o/services/movie/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("movie"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterMovieHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
