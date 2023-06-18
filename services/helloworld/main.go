package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/helloworld/handler"
	pb "m3o.dev/services/helloworld/proto"
	"m3o.dev/services/pkg/tracing"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("helloworld"),
	)

	// Register Handler
	pb.RegisterHelloworldHandler(srv.Server(), new(handler.Helloworld))

	traceCloser := tracing.SetupOpentracing("helloworld")
	defer traceCloser.Close()

	// Run the service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
