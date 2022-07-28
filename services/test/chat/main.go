package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"

	"github.com/m3o/m3o/services/test/chat/handler"
	pb "github.com/m3o/m3o/services/test/chat/proto"
)

func main() {
	// Create the service
	srv := service.New(
		service.Name("chat"),
		service.Version("latest"),
	)

	// Register the handler against the server
	pb.RegisterChatHandler(srv.Server(), new(handler.Chat))

	// Run the service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
