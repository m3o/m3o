package main

import (
	"m3o.dev/services/gifs/handler"
	pb "m3o.dev/services/gifs/proto"
	"m3o.dev/services/pkg/tracing"

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
