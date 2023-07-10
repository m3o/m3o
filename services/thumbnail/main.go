package main

import (
	iproto "m3o.dev/services/image/proto"
	"m3o.dev/services/pkg/tracing"
	"m3o.dev/services/thumbnail/handler"
	pb "m3o.dev/services/thumbnail/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("thumbnail"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterThumbnailHandler(srv.Server(), handler.NewThumbnail(iproto.NewImageService("image", srv.Client())))
	traceCloser := tracing.SetupOpentracing("thumbnail")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
