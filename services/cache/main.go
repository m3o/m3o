package main

import (
	"github.com/m3o/m3o/services/cache/handler"
	pb "github.com/m3o/m3o/services/cache/proto"
	adminpb "github.com/m3o/m3o/services/pkg/service/proto"
	"github.com/m3o/m3o/services/pkg/tracing"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
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
