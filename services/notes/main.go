package main

import (
	"github.com/micro/micro/v3/service"
	log "github.com/micro/micro/v3/service/logger"
	"github.com/m3o/m3o/services/notes/handler"
	pb "github.com/m3o/m3o/services/notes/proto"
)

func main() {
	// New Service
	srv := service.New(
		service.Name("notes"),
		service.Version("latest"),
	)

	// Initialise service
	srv.Init()

	// Register Handler
	pb.RegisterNotesHandler(srv.Server(), handler.New(srv.Client()))

	// Run service
	if err := srv.Run(); err != nil {
		log.Fatal(err)
	}
}
