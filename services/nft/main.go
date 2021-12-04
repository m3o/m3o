package main

import (
	"github.com/m3o/m3o/services/nft/handler"
	pb "github.com/m3o/m3o/services/nft/proto"
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("nft"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterNftHandler(srv.Server(), new(handler.Nft))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
