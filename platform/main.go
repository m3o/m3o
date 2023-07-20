package main

import (
	"m3o.dev/platform/cmd"

	_ "m3o.dev/platform/cli"
	_ "m3o.dev/platform/profile"
	_ "m3o.dev/platform/server"
	_ "m3o.dev/platform/service"
)

func main() {
	cmd.Run()
}
