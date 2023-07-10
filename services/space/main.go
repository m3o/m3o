package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/api"
	"m3o.dev/platform/service/logger"
	admin "m3o.dev/services/pkg/service/proto"
	"m3o.dev/services/space/handler"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("space"),
		service.Version("latest"),
	)

	h := handler.NewSpace(srv)
	// Register handler
	admin.RegisterAdminHandler(srv.Server(), h)
	srv.Server().Handle(
		srv.Server().NewHandler(
			h,
			api.WithEndpoint(
				&api.Endpoint{
					Name:    "Space.Download",
					Handler: "api",
					Method:  []string{"POST", "GET"},
					Path:    []string{"/space/download"},
				}),
		))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
