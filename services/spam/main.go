package main

import (
	"m3o.dev/services/pkg/tracing"
	"m3o.dev/services/spam/handler"
	pb "m3o.dev/services/spam/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("spam"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterSpamHandler(srv.Server(), handler.New())

	traceCloser := tracing.SetupOpentracing("spam")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
