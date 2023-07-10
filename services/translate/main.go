package main

import (
	"m3o.dev/services/translate/handler"
	pb "m3o.dev/services/translate/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("translate"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterTranslateHandler(srv.Server(), handler.NewTranslation())

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
