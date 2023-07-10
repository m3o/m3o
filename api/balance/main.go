package main

import (
	"m3o.dev/api/balance/handler"
	pb "m3o.dev/api/balance/proto"
	"m3o.dev/api/pkg/tracing"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("balance"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterBalanceHandler(srv.Server(), handler.NewHandler(srv))

	traceCloser := tracing.SetupOpentracing("balance")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
