package main

import (
	iproto "github.com/m3o/m3o/services/image/proto"
	"github.com/m3o/m3o/services/pkg/tracing"
	"github.com/m3o/m3o/services/thumbnail/handler"
	pb "github.com/m3o/m3o/services/thumbnail/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
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
