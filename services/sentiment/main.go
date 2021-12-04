package main

import (
	"github.com/m3o/m3o/services/pkg/tracing"
	"github.com/m3o/m3o/services/sentiment/handler"
	pb "github.com/m3o/m3o/services/sentiment/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
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
