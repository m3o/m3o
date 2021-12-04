package main

import (
	"github.com/m3o/m3o/services/pkg/tracing"
	"github.com/m3o/m3o/services/spam/handler"
	pb "github.com/m3o/m3o/services/spam/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
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
