package main

import (
	"m3o.dev/services/pkg/tracing"
	"m3o.dev/services/sentiment/handler"
	pb "m3o.dev/services/sentiment/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("sentiment"),
	)

	// Register handler
	pb.RegisterSentimentHandler(srv.Server(), new(handler.Sentiment))
	traceCloser := tracing.SetupOpentracing("sentiment")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
