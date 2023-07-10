package main

import (
	"m3o.dev/services/test/template/handler"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("idiomatic"),
		service.Version("latest"),
	)

	// Register handler
	srv.Handle(new(handler.Idiomatic))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
