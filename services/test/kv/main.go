package main

import (
	"m3o.dev/services/test/kv/handler"

	"m3o.dev/platform/service"
)

func main() {
	srv := service.New(service.Name("example"))

	srv.Handle(new(handler.Example))

	srv.Run()
}
