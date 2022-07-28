package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"github.com/m3o/m3o/services/answer/handler"
	pb "github.com/m3o/m3o/services/answer/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("answer"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterAnswerHandler(srv.Server(), new(handler.Answer))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
