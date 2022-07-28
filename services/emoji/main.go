package main

import (
	"github.com/m3o/m3o/services/emoji/handler"
	pb "github.com/m3o/m3o/services/emoji/proto"
	"github.com/m3o/m3o/services/pkg/tracing"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("emoji"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterEmojiHandler(srv.Server(), new(handler.Emoji))
	traceCloser := tracing.SetupOpentracing("emoji")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
