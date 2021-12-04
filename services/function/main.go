package main

import (
	db "github.com/m3o/m3o/services/db/proto"
	"github.com/m3o/m3o/services/function/handler"
	pb "github.com/m3o/m3o/services/function/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("function"),
		service.Version("latest"),
	)

	// Register handler
	pb.RegisterFunctionHandler(srv.Server(), handler.NewFunction(db.NewDbService("db", srv.Client())))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
