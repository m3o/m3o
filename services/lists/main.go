package main

import (
	"github.com/micro/micro/v3/service"
	log "github.com/micro/micro/v3/service/logger"
	"github.com/m3o/m3o/services/lists/handler"
	pb "github.com/m3o/m3o/services/lists/proto"
	admin "github.com/m3o/m3o/services/pkg/service/proto"
)

func main() {
	// New Service
	srv := service.New(
		service.Name("lists"),
		service.Version("latest"),
	)

	// Initialise service
	srv.Init()

	h := handler.New(srv.Client())
	// Register Handler
	pb.RegisterListsHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)

	// Run service
	if err := srv.Run(); err != nil {
		log.Fatal(err)
	}
}
