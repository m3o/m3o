package server

import (
	"fmt"

	ccli "github.com/urfave/cli/v2"
	"m3o.dev/platform/cmd"
	"m3o.dev/platform/service/logger"

	// services
	api "m3o.dev/platform/service/api/server"
	auth "m3o.dev/platform/service/auth/server"
	broker "m3o.dev/platform/service/broker/server"
	config "m3o.dev/platform/service/config/server"
	events "m3o.dev/platform/service/events/server"
	network "m3o.dev/platform/service/network/server"
	proxy "m3o.dev/platform/service/proxy/server"
	registry "m3o.dev/platform/service/registry/server"
	runtime "m3o.dev/platform/service/runtime/server"
	store "m3o.dev/platform/service/store/server"
)

type srvCommand struct {
	Name    string
	Command ccli.ActionFunc
	Flags   []ccli.Flag
}

var srvCommands = []srvCommand{
	{
		Name:    "api",
		Command: api.Run,
		Flags:   api.Flags,
	},
	{
		Name:    "auth",
		Command: auth.Run,
		Flags:   auth.Flags,
	},
	{
		Name:    "broker",
		Command: broker.Run,
	},
	{
		Name:    "config",
		Command: config.Run,
		Flags:   config.Flags,
	},
	{
		Name:    "events",
		Command: events.Run,
	},
	{
		Name:    "network",
		Command: network.Run,
		Flags:   network.Flags,
	},
	{
		Name:    "proxy",
		Command: proxy.Run,
		Flags:   proxy.Flags,
	},
	{
		Name:    "registry",
		Command: registry.Run,
	},
	{
		Name:    "runtime",
		Command: runtime.Run,
		Flags:   runtime.Flags,
	},
	{
		Name:    "store",
		Command: store.Run,
	},
}

func init() {
	// move newAction outside the loop and pass c as an arg to
	// set the scope of the variable
	newAction := func(c srvCommand) func(ctx *ccli.Context) error {
		return func(ctx *ccli.Context) error {
			// configure the loggerger
			logger.DefaultLogger.Init(logger.WithFields(map[string]interface{}{"service": c.Name}))

			// run the service
			c.Command(ctx)
			return nil
		}
	}

	subcommands := make([]*ccli.Command, len(srvCommands))
	for i, c := range srvCommands {
		// construct the command
		command := &ccli.Command{
			Name:   c.Name,
			Flags:  c.Flags,
			Usage:  fmt.Sprintf("Run micro %v", c.Name),
			Action: newAction(c),
		}

		// set the command
		subcommands[i] = command
	}

	command := &ccli.Command{
		Name:        "service",
		Usage:       "Run a micro service",
		Subcommands: subcommands,
	}

	cmd.Register(command)
}
