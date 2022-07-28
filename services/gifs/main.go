package main

import (
	"github.com/m3o/m3o/services/gifs/handler"
	pb "github.com/m3o/m3o/services/gifs/proto"
	"github.com/m3o/m3o/services/pkg/tracing"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("gifs"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterGifsHandler(srv.Server(), handler.New())
	traceCloser := tracing.SetupOpentracing("gifs")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
