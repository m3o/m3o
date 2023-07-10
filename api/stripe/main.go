package main

import (
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/api"
	"m3o.dev/platform/service/logger"
	"m3o.dev/api/pkg/tracing"
	"m3o.dev/api/stripe/handler"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("stripe"),
		service.Version("latest"),
	)
	srv.Server().Handle(
		srv.Server().NewHandler(
			handler.NewHandler(srv),
			api.WithEndpoint(
				&api.Endpoint{
					Name:    "Stripe.Webhook",
					Handler: "api",
					Method:  []string{"POST"},
					Path:    []string{"/stripe/webhook"},
				}),
		))
	traceCloser := tracing.SetupOpentracing("stripe")
	defer traceCloser.Close()

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
