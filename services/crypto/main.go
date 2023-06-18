package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/crypto/handler"
	pb "m3o.dev/services/crypto/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("crypto"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterCryptoHandler(srv.Server(), handler.New())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
