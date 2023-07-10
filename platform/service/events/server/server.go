package server

import (
	"github.com/urfave/cli/v2"
	pb "m3o.dev/platform/proto/events"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/events/handler"
	"m3o.dev/platform/service/logger"
)

// Run the micro broker
func Run(ctx *cli.Context) error {
	// new service
	srv := service.New(
		service.Name("events"),
	)

	// register the handlers
	pb.RegisterStreamHandler(srv.Server(), new(handler.Stream))
	pb.RegisterStoreHandler(srv.Server(), new(handler.Store))

	// run the service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}

	return nil
}
