package main

import (
	"m3o.dev/services/avatar/handler"
	pb "m3o.dev/services/avatar/proto"
	imagePb "m3o.dev/services/image/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("avatar"),
		service.Version("latest"),
	)

	// Register handler
	hdlr := handler.NewAvatar(imagePb.NewImageService("image", srv.Client()))
	pb.RegisterAvatarHandler(srv.Server(), hdlr)

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
