package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/wallet/handler"
	pb "m3o.dev/services/wallet/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("wallet"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterWalletHandler(srv.Server(), handler.NewHandler(srv))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
