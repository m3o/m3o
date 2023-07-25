package profile

import (
	"crypto/tls"
	"os"
	"sync"

	"github.com/go-redis/redis/v8"
	"github.com/urfave/cli/v2"
	"m3o.dev/platform/plugin/etcd"
	"m3o.dev/platform/plugin/postgres"
	"m3o.dev/platform/plugin/redis/blocklist"
	redisBroker "m3o.dev/platform/plugin/redis/broker"
	redisstream "m3o.dev/platform/plugin/redis/stream"
	"m3o.dev/platform/plugin/s3"
	auth2 "m3o.dev/platform/service/api/auth"
	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/auth/jwt"
	"m3o.dev/platform/service/broker"
	microBuilder "m3o.dev/platform/service/build"
	"m3o.dev/platform/service/build/golang"
	"m3o.dev/platform/service/events"
	evStore "m3o.dev/platform/service/events/store"
	"m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/registry"
	microRuntime "m3o.dev/platform/service/runtime"
	"m3o.dev/platform/service/runtime/kubernetes"
	"m3o.dev/platform/service/store"
)

func init() {
	Register("platform", Platform)
	Register("platform_client", PlatformClient)
}

var (
	// hack because setup func is called multiple times due to before func weirdness
	platformOnce sync.Once
	clientOnce   sync.Once
)

// Profile is for running the micro platform
var Platform = &Profile{
	Name: "platform",
	Setup: func(ctx *cli.Context) error {
		var retErr error
		platformOnce.Do(func() {
			auth.DefaultAuth = jwt.NewAuth()
			// the cockroach store will connect immediately so the address must be passed
			// when the store is created. The cockroach store address contains the location
			// of certs so it can't be defaulted like the broker and registry.
			store.DefaultStore = postgres.NewStore(store.Nodes(ctx.String("store_address")))
			SetupBroker(redisBroker.NewBroker(broker.Addrs(ctx.String("broker_address"))))
			SetupRegistry(etcd.NewRegistry(registry.Addrs(ctx.String("registry_address"))))
			SetupJWT(ctx)
			SetupConfigSecretKey(ctx)

			var err error
			if ctx.Args().Get(1) == "events" {
				events.DefaultStream, err = redisstream.NewStream(redisStreamOpts(ctx)...)
				if err != nil {
					logger.Fatalf("Error configuring stream: %v", err)
				}

				opts := []s3.Option{
					s3.Credentials(
						os.Getenv("MICRO_EVENTS_STORE_ACCESS_KEY"),
						os.Getenv("MICRO_EVENTS_STORE_SECRET_KEY"),
					),
					s3.Endpoint(os.Getenv("MICRO_EVENTS_STORE_ENDPOINT")),
					s3.Region(os.Getenv("MICRO_EVENTS_STORE_REGION")),
					s3.Bucket(os.Getenv("MICRO_EVENTS_STORE_BUCKET")),
				}

				events.DefaultStore = evStore.NewStore(
					evStore.WithStore(store.DefaultStore),
					evStore.WithBackup(s3.NewBackup(opts...)),
				)

			}

			// only configure the blob store for the store and runtime services
			if ctx.Args().Get(1) == "runtime" || ctx.Args().Get(1) == "store" {
				opts := []s3.Option{
					s3.Credentials(
						os.Getenv("MICRO_BLOB_STORE_ACCESS_KEY"),
						os.Getenv("MICRO_BLOB_STORE_SECRET_KEY"),
					),
					s3.Endpoint(os.Getenv("MICRO_BLOB_STORE_ENDPOINT")),
					s3.Region(os.Getenv("MICRO_BLOB_STORE_REGION")),
					s3.Bucket(os.Getenv("MICRO_BLOB_STORE_BUCKET")),
				}
				if val := os.Getenv("MICRO_BLOB_STORE_INSECURE"); len(val) > 0 {
					opts = append(opts, s3.Insecure())
				}

				store.DefaultBlobStore, err = s3.NewBlobStore(opts...)
				if err != nil {
					logger.Fatalf("Error configuring s3 blob store: %v", err)
				}
			}

			microRuntime.DefaultRuntime = kubernetes.NewRuntime()
			microBuilder.DefaultBuilder, err = golang.NewBuilder()
			if err != nil {
				logger.Fatalf("Error configuring golang builder: %v", err)
			}

			kubernetes.DefaultImage = "ghcr.io/m3o/cells:v3"
		})
		return retErr
	},
}

// natsStreamOpts returns a slice of options which should be used to configure nats
func redisStreamOpts(ctx *cli.Context) []redisstream.Option {
	fullAddr := ctx.String("broker_address")
	o, err := redis.ParseURL(fullAddr)
	if err != nil {
		logger.Fatalf("Error configuring redis connection, failed to parse %s", fullAddr)
	}

	opts := []redisstream.Option{
		redisstream.Address(o.Addr),
		redisstream.User(o.Username),
		redisstream.Password(o.Password),
	}
	if o.TLSConfig != nil {
		opts = append(opts, redisstream.TLSConfig(o.TLSConfig))
	}

	return opts
}

var PlatformClient = &Profile{
	Name: "platform_client",
	Setup: func(ctx *cli.Context) error {
		var retErr error
		clientOnce.Do(func() {
			auth2.DefaultBlockList = blocklist.New(
				os.Getenv("MICRO_API_REDIS_ADDRESS"),
				os.Getenv("MICRO_API_REDIS_USER"),
				os.Getenv("MICRO_API_REDIS_PASSWORD"),
				&tls.Config{})
		})
		return retErr
	},
}
