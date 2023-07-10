package server

import (
	"github.com/urfave/cli/v2"
	pb "m3o.dev/platform/proto/auth"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/auth/handler"
	log "m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/store"
	mustore "m3o.dev/platform/service/store"
	"m3o.dev/platform/util/auth/token"
	"m3o.dev/platform/util/auth/token/jwt"
)

// Flags specific to the router
var Flags = []cli.Flag{
	&cli.BoolFlag{
		Name:    "disable_admin",
		EnvVars: []string{"MICRO_AUTH_DISABLE_ADMIN"},
		Usage:   "Prevent generation of default accounts in namespaces",
	},
}

const (
	name    = "auth"
	address = ":8010"
)

// Run the auth service
func Run(ctx *cli.Context) error {
	srv := service.New(
		service.Name(name),
		service.Address(address),
	)

	// setup the handlers
	ruleH := &handler.Rules{}
	authH := &handler.Auth{
		DisableAdmin: ctx.Bool("disable_admin"),
	}

	// setup the auth handler to use JWTs
	authH.TokenProvider = jwt.NewTokenProvider(
		token.WithPublicKey(auth.DefaultAuth.Options().PublicKey),
		token.WithPrivateKey(auth.DefaultAuth.Options().PrivateKey),
	)

	// set the handlers store
	mustore.DefaultStore.Init(store.Table("auth"))
	authH.Init(auth.Store(mustore.DefaultStore))
	ruleH.Init(auth.Store(mustore.DefaultStore))

	// register handlers
	pb.RegisterAuthHandler(srv.Server(), authH)
	pb.RegisterRulesHandler(srv.Server(), ruleH)
	pb.RegisterAccountsHandler(srv.Server(), authH)

	// run service
	if err := srv.Run(); err != nil {
		log.Fatal(err)
	}
	return nil
}
