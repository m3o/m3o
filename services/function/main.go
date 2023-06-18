package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/function/handler"
	pb "m3o.dev/services/function/proto"
	admin "m3o.dev/services/pkg/service/proto"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("function"),
		service.Version("latest"),
	)

	h := handler.NewFunction(srv)
	// Register handler
	pb.RegisterFunctionHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
