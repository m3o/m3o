package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/app/handler"
	pb "m3o.dev/services/app/proto"
	admin "m3o.dev/services/pkg/service/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("app"),
		service.Version("latest"),
	)

	h := handler.New(srv)
	// Register handler
	pb.RegisterAppHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
