package main

import (
	"m3o.dev/services/movie/handler"
	pb "m3o.dev/services/movie/proto"

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
