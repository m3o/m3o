package main

import (
	"m3o.dev/api/oauth/handler"

	"m3o.dev/platform/service"
	mauth "m3o.dev/platform/service/auth/client"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("oauth"),
		service.Version("latest"),
	)

	// passing in auth because the DefaultAuth is the one used to set up the service
	auth := mauth.NewAuth()

	// Register Handler
	srv.Handle(handler.NewOauth(srv, auth))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
