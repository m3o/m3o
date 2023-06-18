package main

import (
	"github.com/micro/micro/v3/service"
	log "github.com/micro/micro/v3/service/logger"
	"m3o.dev/services/notes/handler"
	pb "m3o.dev/services/notes/proto"
	admin "m3o.dev/services/pkg/service/proto"
)

func main() {
	// New Service
	srv := service.New(
		service.Name("notes"),
		service.Version("latest"),
	)

	// Initialise service
	srv.Init()

	h := handler.New(srv.Client())
	// Register Handler
	pb.RegisterNotesHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)

	// Run service
	if err := srv.Run(); err != nil {
		log.Fatal(err)
	}
}
