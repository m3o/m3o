package store

import (
	"github.com/urfave/cli/v2"
	pb "m3o.dev/platform/proto/store"
	"m3o.dev/platform/service"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store/handler"
)

var (
	// name of the store service
	name = "store"
	// address is the store address
	address = ":8002"
)

// Run micro store
func Run(ctx *cli.Context) error {
	if len(ctx.String("server_name")) > 0 {
		name = ctx.String("server_name")
	}
	if len(ctx.String("address")) > 0 {
		address = ctx.String("address")
	}

	// Initialise service
	service := service.New(
		service.Name(name),
		service.Address(address),
	)

	// the store handler
	pb.RegisterStoreHandler(service.Server(), &handler.Store{
		Stores: make(map[string]bool),
	})

	// the blob store handler
	pb.RegisterBlobStoreHandler(service.Server(), new(handler.BlobStore))

	// start the service
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
	return nil
}
