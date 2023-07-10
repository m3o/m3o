package main

import (
	"m3o.dev/services/cache/handler"
	pb "m3o.dev/services/cache/proto"
	adminpb "m3o.dev/services/pkg/service/proto"
	"m3o.dev/services/pkg/tracing"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("cache"),
		service.Version("latest"),
	)

	// Register handler
	c := new(handler.Cache)
	pb.RegisterCacheHandler(srv.Server(), c)
	adminpb.RegisterAdminHandler(srv.Server(), c)

	traceCloser := tracing.SetupOpentracing("cache")
	defer traceCloser.Close()
	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
