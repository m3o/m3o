package main

import (
	admin "m3o.dev/services/pkg/service/proto"
	"m3o.dev/services/pkg/tracing"
	"m3o.dev/services/url/handler"
	pb "m3o.dev/services/url/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("url"),
		service.Version("latest"),
	)
	h := handler.NewUrl(srv)
	// Register handler
	pb.RegisterUrlHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)

	traceCloser := tracing.SetupOpentracing("url")
	defer traceCloser.Close()
	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
