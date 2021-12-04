package main

import (
	"github.com/m3o/m3o/services/image/handler"
	pb "github.com/m3o/m3o/services/image/proto"
	"github.com/m3o/m3o/services/pkg/tracing"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("image"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterImageHandler(srv.Server(), handler.NewImage())
	traceCloser := tracing.SetupOpentracing("image")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
