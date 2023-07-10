package server

import (
	"time"

	"github.com/urfave/cli/v2"
	pb "m3o.dev/platform/proto/broker"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/broker"
	"m3o.dev/platform/service/broker/handler"
	"m3o.dev/platform/service/logger"
)

var (
	name    = "broker"
	address = ":8003"
)

// Run the micro broker
func Run(ctx *cli.Context) error {
	srvOpts := []service.Option{
		service.Name(name),
		service.Address(address),
	}

	if i := time.Duration(ctx.Int("register_ttl")); i > 0 {
		srvOpts = append(srvOpts, service.RegisterTTL(i*time.Second))
	}
	if i := time.Duration(ctx.Int("register_interval")); i > 0 {
		srvOpts = append(srvOpts, service.RegisterInterval(i*time.Second))
	}

	// new service
	srv := service.New(srvOpts...)

	// connect to the broker
	broker.DefaultBroker.Connect()

	// register the broker Broker
	pb.RegisterBrokerHandler(srv.Server(), new(handler.Broker))

	// run the service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
	return nil
}
