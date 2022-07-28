package main

import (
	"github.com/m3o/m3o/services/avatar/handler"
	pb "github.com/m3o/m3o/services/avatar/proto"
	imagePb "github.com/m3o/m3o/services/image/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
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
