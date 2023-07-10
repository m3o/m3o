package main

import (
	"m3o.dev/api/pkg/tracing"
	"m3o.dev/api/publicapi/handler"
	pb "m3o.dev/api/publicapi/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("publicapi"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterPublicapiHandler(srv.Server(), handler.NewPublicAPIHandler(srv))
	pb.RegisterExploreHandler(srv.Server(), handler.NewExploreAPIHandler(srv))
	traceCloser := tracing.SetupOpentracing("publicapi")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
