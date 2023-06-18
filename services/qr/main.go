package main

import (
	admin "m3o.dev/services/pkg/service/proto"
	"m3o.dev/services/pkg/tracing"
	"m3o.dev/services/qr/handler"
	pb "m3o.dev/services/qr/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("qr"),
		service.Version("latest"),
	)

	h := handler.New()
	// Register handler
	pb.RegisterQrHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)
	traceCloser := tracing.SetupOpentracing("qr")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
