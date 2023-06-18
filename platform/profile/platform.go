// Package platform is a profile for running a highly available Micro platform
package platform

import (
	"crypto/tls"
	"os"
	"sync"

	"github.com/go-redis/redis/v8"
	"m3o.dev/platform/plugin/postgres"
	"m3o.dev/platform/plugin/redis/blocklist"
	"m3o.dev/platform/plugin/s3"
	"github.com/micro/micro/v3/profile"
	auth2 "github.com/micro/micro/v3/service/api/auth"
	"github.com/micro/micro/v3/service/auth"
	"github.com/micro/micro/v3/service/auth/jwt"
	"github.com/micro/micro/v3/service/broker"
	microBuilder "github.com/micro/micro/v3/service/build"
	"github.com/micro/micro/v3/service/build/golang"
	"github.com/micro/micro/v3/service/events"
	evStore "github.com/micro/micro/v3/service/events/store"
	"github.com/micro/micro/v3/service/logger"
	"github.com/micro/micro/v3/service/registry"
	microRuntime "github.com/micro/micro/v3/service/runtime"
	"github.com/micro/micro/v3/service/runtime/kubernetes"
	"github.com/micro/micro/v3/service/store"
	"github.com/urfave/cli/v2"
	"m3o.dev/platform/plugin/etcd"
	redisBroker "m3o.dev/platform/plugin/redis/broker"
	redisstream "m3o.dev/platform/plugin/redis/stream"
)

func init() {
	profile.Register("platform", Profile)
	profile.Register("platform_client", ClientProfile)
}

var (
	// hack because setup func is called multiple times due to before func weirdness
	platformOnce sync.Once
	clientOnce   sync.Once
)

// Profile is for running the micro platform
var Profile = &profile.Profile{
	Name: "platform",
	Setup: func(ctx *cli.Context) error {
		var retErr error
		platformOnce.Do(func() {
			auth.DefaultAuth = jwt.NewAuth()
			// the cockroach store will connect immediately so the address must be passed
			// when the store is created. The cockroach store address contains the location
			// of certs so it can't be defaulted like the broker and registry.
			store.DefaultStore = postgres.NewStore(store.Nodes(ctx.String("store_address")))
			profile.SetupBroker(redisBroker.NewBroker(broker.Addrs(ctx.String("broker_address"))))
			profile.SetupRegistry(etcd.NewRegistry(registry.Addrs(ctx.String("registry_address"))))
			profile.SetupJWT(ctx)
			profile.SetupConfigSecretKey(ctx)

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

			kubernetes.DefaultImage = "ghcr.io/micro/cells:v3"
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

// ClientProfile is for clients running on the micro platform
var ClientProfile = &profile.Profile{
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
