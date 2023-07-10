// Package profile is for specific profiles
// @todo this package is the definition of cruft and
// should be rewritten in a more elegant way
package profile

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/urfave/cli/v2"
	"m3o.dev/platform/service/auth/jwt"
	"m3o.dev/platform/service/auth/noop"
	"m3o.dev/platform/service/broker"
	memBroker "m3o.dev/platform/service/broker/memory"
	"m3o.dev/platform/service/client"
	grpcClient "m3o.dev/platform/service/client/grpc"
	"m3o.dev/platform/service/config"
	storeConfig "m3o.dev/platform/service/config/store"
	evStore "m3o.dev/platform/service/events/store"
	memStream "m3o.dev/platform/service/events/stream/memory"
	"m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/model"
	"m3o.dev/platform/service/registry"
	"m3o.dev/platform/service/registry/memory"
	"m3o.dev/platform/service/router"
	regRouter "m3o.dev/platform/service/router/registry"
	"m3o.dev/platform/service/runtime/local"
	"m3o.dev/platform/service/server"
	grpcServer "m3o.dev/platform/service/server/grpc"
	"m3o.dev/platform/service/store/file"
	mem "m3o.dev/platform/service/store/memory"

	microAuth "m3o.dev/platform/service/auth"
	microEvents "m3o.dev/platform/service/events"
	microRuntime "m3o.dev/platform/service/runtime"
	microStore "m3o.dev/platform/service/store"
	inAuth "m3o.dev/platform/util/auth"
	"m3o.dev/platform/util/user"
)

// profiles which when called will configure micro to run in that environment
var profiles = map[string]*Profile{
	// built in profiles
	"client":  Client,
	"service": Service,
	"server":  Server,
	"test":    Test,
	"local":   Local,
}

// Profile configures an environment
type Profile struct {
	// name of the profile
	Name string
	// function used for setup
	Setup func(*cli.Context) error
	// TODO: presetup dependencies
	// e.g start resources
}

// Register a profile
func Register(name string, p *Profile) error {
	if _, ok := profiles[name]; ok {
		return fmt.Errorf("profile %s already exists", name)
	}
	profiles[name] = p
	return nil
}

// Load a profile
func Load(name string) (*Profile, error) {
	v, ok := profiles[name]
	if !ok {
		return nil, fmt.Errorf("profile %s does not exist", name)
	}
	return v, nil
}

// Client profile is for any entrypoint that behaves as a client
var Client = &Profile{
	Name:  "client",
	Setup: func(ctx *cli.Context) error { return nil },
}

// Local profile to run as a single process
var Local = &Profile{
	Name: "local",
	Setup: func(ctx *cli.Context) error {
		// set client/server
		client.DefaultClient = grpcClient.NewClient()
		server.DefaultServer = grpcServer.NewServer()

		microAuth.DefaultAuth = jwt.NewAuth()
		microStore.DefaultStore = file.NewStore(file.WithDir(filepath.Join(user.Dir, "server", "store")))
		SetupConfigSecretKey(ctx)
		config.DefaultConfig, _ = storeConfig.NewConfig(microStore.DefaultStore, "")

		SetupJWT(ctx)
		SetupRegistry(memory.NewRegistry())
		SetupBroker(memBroker.NewBroker())

		// set the store in the model
		model.DefaultModel = model.NewModel(
			model.WithStore(microStore.DefaultStore),
		)

		microRuntime.DefaultRuntime = local.NewRuntime()

		var err error
		microEvents.DefaultStream, err = memStream.NewStream()
		if err != nil {
			logger.Fatalf("Error configuring stream: %v", err)
		}
		microEvents.DefaultStore = evStore.NewStore(
			evStore.WithStore(microStore.DefaultStore),
		)

		microStore.DefaultBlobStore, err = file.NewBlobStore()
		if err != nil {
			logger.Fatalf("Error configuring file blob store: %v", err)
		}

		return nil
	},
}

var Server = &Profile{
	Name: "server",
	Setup: func(ctx *cli.Context) error {
		microAuth.DefaultAuth = jwt.NewAuth()
		microStore.DefaultStore = file.NewStore(file.WithDir(filepath.Join(user.Dir, "server", "store")))
		SetupConfigSecretKey(ctx)
		config.DefaultConfig, _ = storeConfig.NewConfig(microStore.DefaultStore, "")
		SetupJWT(ctx)

		// the registry service uses the memory registry, the other core services will use the default
		// rpc client and call the registry service
		if ctx.Args().Get(1) == "registry" {
			SetupRegistry(memory.NewRegistry())
		} else {
			// set the registry address
			registry.DefaultRegistry.Init(
				registry.Addrs("localhost:8000"),
			)

			SetupRegistry(registry.DefaultRegistry)
		}

		// the broker service uses the memory broker, the other core services will use the default
		// rpc client and call the broker service
		if ctx.Args().Get(1) == "broker" {
			SetupBroker(memBroker.NewBroker())
		} else {
			broker.DefaultBroker.Init(
				broker.Addrs("localhost:8003"),
			)
			SetupBroker(broker.DefaultBroker)
		}

		// set the store in the model
		model.DefaultModel = model.NewModel(
			model.WithStore(microStore.DefaultStore),
		)

		// use the local runtime, note: the local runtime is designed to run source code directly so
		// the runtime builder should NOT be set when using this implementation
		microRuntime.DefaultRuntime = local.NewRuntime()

		var err error
		microEvents.DefaultStream, err = memStream.NewStream()
		if err != nil {
			logger.Fatalf("Error configuring stream: %v", err)
		}
		microEvents.DefaultStore = evStore.NewStore(
			evStore.WithStore(microStore.DefaultStore),
		)

		microStore.DefaultBlobStore, err = file.NewBlobStore()
		if err != nil {
			logger.Fatalf("Error configuring file blob store: %v", err)
		}

		return nil
	},
}

// Service is the default for any services run
var Service = &Profile{
	Name:  "service",
	Setup: func(ctx *cli.Context) error { return nil },
}

// Test profile is used for the go test suite
var Test = &Profile{
	Name: "test",
	Setup: func(ctx *cli.Context) error {
		microAuth.DefaultAuth = noop.NewAuth()
		microStore.DefaultStore = mem.NewStore()
		microStore.DefaultBlobStore, _ = file.NewBlobStore()
		config.DefaultConfig, _ = storeConfig.NewConfig(microStore.DefaultStore, "")
		SetupRegistry(memory.NewRegistry())
		// set the store in the model
		model.DefaultModel = model.NewModel(
			model.WithStore(microStore.DefaultStore),
		)
		return nil
	},
}

// SetupRegistry configures the registry
func SetupRegistry(reg registry.Registry) {
	registry.DefaultRegistry = reg
	router.DefaultRouter = regRouter.NewRouter(router.Registry(reg))
	client.DefaultClient.Init(client.Registry(reg), client.Router(router.DefaultRouter))
	server.DefaultServer.Init(server.Registry(reg))
}

// SetupBroker configures the broker
func SetupBroker(b broker.Broker) {
	broker.DefaultBroker = b
	client.DefaultClient.Init(client.Broker(b))
	server.DefaultServer.Init(server.Broker(b))
}

// SetupJWT configures the default internal system rules
func SetupJWT(ctx *cli.Context) {
	for _, rule := range inAuth.SystemRules {
		if err := microAuth.DefaultAuth.Grant(rule); err != nil {
			logger.Fatal("Error creating default rule: %v", err)
		}
	}
}

func SetupConfigSecretKey(ctx *cli.Context) {
	key := ctx.String("config_secret_key")
	if len(key) == 0 {
		k, err := user.GetConfigSecretKey()
		if err != nil {
			logger.Fatal("Error getting config secret: %v", err)
		}
		os.Setenv("MICRO_CONFIG_SECRET_KEY", k)
	}
}
