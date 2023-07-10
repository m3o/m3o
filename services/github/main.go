package main

import (
	"m3o.dev/platform/service/api"
	"m3o.dev/services/github/handler"
	admin "m3o.dev/services/pkg/service/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("github"),
		service.Version("latest"),
	)

	h := handler.NewHandler(srv)
	srv.Server().Handle(
		srv.Server().NewHandler(
			h,
			api.WithEndpoint(
				&api.Endpoint{
					Name:    "Github.Webhook",
					Handler: "api",
					Method:  []string{"POST"},
					Path:    []string{"/github/webhook"},
				}),
		))

	admin.RegisterAdminHandler(srv.Server(), h)
	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
