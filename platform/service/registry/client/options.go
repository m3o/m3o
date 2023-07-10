package client

import (
	"context"

	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/registry"
)

type clientKey struct{}

// WithClient sets the RPC client
func WithClient(c client.Client) registry.Option {
	return func(o *registry.Options) {
		if o.Context == nil {
			o.Context = context.Background()
		}

		o.Context = context.WithValue(o.Context, clientKey{}, c)
	}
}
