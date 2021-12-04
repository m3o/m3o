package main

import (
	"github.com/m3o/m3o/services/pkg/tracing"
	"github.com/m3o/m3o/services/qr/handler"
	pb "github.com/m3o/m3o/services/qr/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("qr"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterQrHandler(srv.Server(), handler.New())
	traceCloser := tracing.SetupOpentracing("qr")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
