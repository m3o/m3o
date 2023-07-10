package handler

import (
	"m3o.dev/platform/service/api"
	"m3o.dev/platform/service/client"
)

type Context interface {
	Client() client.Client
	Service() *api.Service
	Domain() string
}
