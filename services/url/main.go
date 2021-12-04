package main

import (
	"github.com/m3o/m3o/services/pkg/tracing"
	"github.com/m3o/m3o/services/url/handler"
	pb "github.com/m3o/m3o/services/url/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("url"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterUrlHandler(srv.Server(), handler.NewUrl())

	traceCloser := tracing.SetupOpentracing("url")
	defer traceCloser.Close()
	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
