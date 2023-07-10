package main

import (
	"m3o.dev/services/minecraft/handler"
	pb "m3o.dev/services/minecraft/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("minecraft"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterMinecraftHandler(srv.Server(), new(handler.Minecraft))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
