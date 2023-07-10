package server

import (
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/urfave/cli/v2"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/client"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/network"
	"m3o.dev/platform/service/network/handler"
	"m3o.dev/platform/service/network/tunnel"
	tmucp "m3o.dev/platform/service/network/tunnel/mucp"
	"m3o.dev/platform/service/proxy"
	grpcProxy "m3o.dev/platform/service/proxy/grpc"
	mucpProxy "m3o.dev/platform/service/proxy/mucp"
	"m3o.dev/platform/service/router"
	"m3o.dev/platform/service/server"
	mucpServer "m3o.dev/platform/service/server/mucp"
	"m3o.dev/platform/util/helper"
	"m3o.dev/platform/util/muxer"
)

var (
	// name of the network service
	name = "network"
	// name of the micro network
	networkName = "micro"
	// address is the network address
	address = ":8443"
	// peerAddress is the address the network peers on
	peerAddress = ":8085"
	// set the advertise address
	advertise = ""
	// the tunnel token
	token = "micro"

	// Flags specific to the network
	Flags = []cli.Flag{
		&cli.StringFlag{
			Name:    "address",
			Usage:   "Set the address of the network service",
			EnvVars: []string{"MICRO_NETWORK_ADDRESS"},
		},
		&cli.StringFlag{
			Name:    "advertise",
			Usage:   "Set the micro network address to advertise",
			EnvVars: []string{"MICRO_NETWORK_ADVERTISE"},
		},
		&cli.StringFlag{
			Name:    "gateway",
			Usage:   "Set the default gateway",
			EnvVars: []string{"MICRO_NETWORK_GATEWAY"},
		},
		&cli.StringFlag{
			Name:    "network",
			Usage:   "Set the micro network name: micro",
			EnvVars: []string{"MICRO_NETWORK"},
		},
		&cli.StringFlag{
			Name:    "nodes",
			Usage:   "Set the micro network nodes to connect to. This can be a comma separated list.",
			EnvVars: []string{"MICRO_NETWORK_NODES"},
		},
		&cli.StringFlag{
			Name:    "token",
			Usage:   "Set the micro network token for authentication",
			EnvVars: []string{"MICRO_NETWORK_TOKEN"},
		},
	}
)

// Run runs the micro server
func Run(ctx *cli.Context) error {
	if len(ctx.String("server_name")) > 0 {
		name = ctx.String("server_name")
	}
	if len(ctx.String("address")) > 0 {
		address = ctx.String("address")
	}
	if len(ctx.String("peer_address")) > 0 {
		peerAddress = ctx.String("peer_address")
	}
	if len(ctx.String("advertise")) > 0 {
		advertise = ctx.String("advertise")
	}
	if len(ctx.String("network")) > 0 {
		networkName = ctx.String("network")
	}
	if len(ctx.String("token")) > 0 {
		token = ctx.String("token")
	}

	var nodes []string
	if len(ctx.String("nodes")) > 0 {
		nodes = strings.Split(ctx.String("nodes"), ",")
	}

	// Initialise the local service
	service := service.New(
		service.Name(name),
		service.Address(address),
	)

	// create a tunnel
	tunOpts := []tunnel.Option{
		tunnel.Address(peerAddress),
		tunnel.Token(token),
	}

	if ctx.Bool("enable_tls") {
		config, err := helper.TLSConfig(ctx)
		if err != nil {
			fmt.Println(err.Error())
			return err
		}
		config.InsecureSkipVerify = true
	}

	gateway := ctx.String("gateway")
	tun := tmucp.NewTunnel(tunOpts...)
	id := service.Server().Options().Id

	// increase the client retries
	client.DefaultClient.Init(
		client.Retries(3),
	)

	// local tunnel router
	rtr := router.DefaultRouter

	rtr.Init(
		router.Network(networkName),
		router.Id(id),
		router.Gateway(gateway),
		router.Cache(),
	)

	// initialise network vals
	network.DefaultNetwork.Init(
		network.Id(id),
		network.Name(networkName),
		network.Address(peerAddress),
		network.Advertise(advertise),
		network.Nodes(nodes...),
		network.Tunnel(tun),
		network.Router(rtr),
	)

	netService := network.DefaultNetwork

	// local proxy using grpc
	// TODO: reenable after PR
	localProxy := grpcProxy.NewProxy(
		proxy.WithRouter(rtr),
		proxy.WithClient(service.Client()),
	)

	// network proxy
	// used by the network nodes to cluster
	// and share routes or route through
	// each other
	networkProxy := mucpProxy.NewProxy(
		proxy.WithRouter(rtr),
		proxy.WithClient(service.Client()),
		proxy.WithLink("network", netService.Client()),
	)

	// create a handler
	h := mucpServer.DefaultRouter.NewHandler(
		&handler.Network{Network: netService},
	)

	// register the handler
	mucpServer.DefaultRouter.Handle(h)

	// local mux
	localMux := muxer.New(name, localProxy)

	// network mux
	networkMux := muxer.New(name, networkProxy)

	// init the local grpc server
	service.Server().Init(
		server.WithRouter(localMux),
	)

	// set network server to proxy
	netService.Server().Init(
		server.WithRouter(networkMux),
	)

	// connect network
	if err := netService.Connect(); err != nil {
		log.Fatalf("Network failed to connect: %v", err)
	}

	// netClose hard exits if we have problems
	netClose := func(net network.Network) error {
		errChan := make(chan error, 1)

		go func() {
			errChan <- net.Close()
		}()

		select {
		case err := <-errChan:
			return err
		case <-time.After(time.Second):
			return errors.New("Network timeout closing")
		}
	}

	log.Infof("Network [%s] listening on %s", networkName, peerAddress)

	if err := service.Run(); err != nil {
		log.Errorf("Network %s failed: %v", networkName, err)
		netClose(netService)
		os.Exit(1)
	}

	// close the network
	netClose(netService)

	return nil
}
