package main

import (
	"m3o.dev/services/file/handler"
	pb "m3o.dev/services/file/proto"
	admin "m3o.dev/services/pkg/service/proto"
	"m3o.dev/services/pkg/tracing"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("file"),
		service.Version("latest"),
	)

	h := handler.NewFile()
	// Register handler
	pb.RegisterFileHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)

	traceCloser := tracing.SetupOpentracing("file")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
