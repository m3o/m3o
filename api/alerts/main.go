package main

import (
	"m3o.dev/platform/service"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/api/alerts/handler"
	"m3o.dev/api/pkg/tracing"
)

func main() {
	// New Service
	srv := service.New(
		service.Name("alerts"),
	)

	// Register Handler
	srv.Handle(handler.New())

	traceCloser := tracing.SetupOpentracing("alerts")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		log.Fatal(err)
	}
}
