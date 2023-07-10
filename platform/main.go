package main

import (
	_ "m3o.dev/platform/cli"
	"m3o.dev/platform/cmd"
	_ "m3o.dev/platform/profile"
	_ "m3o.dev/platform/server"
	_ "m3o.dev/platform/service"
)

func main() {
	cmd.Run()
}
