package main

import (
	"math/rand"
	"time"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/id/handler"
	pb "m3o.dev/services/id/proto"
	"m3o.dev/services/pkg/tracing"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func main() {
	// Create service
	srv := service.New(
		service.Name("id"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterIdHandler(srv.Server(), handler.New())
	traceCloser := tracing.SetupOpentracing("id")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
