package main

import (
	"github.com/micro/micro/v3/cmd"

	// load packages so they can register commands
	_ "github.com/micro/micro/v3/client/cli"
	_ "github.com/micro/micro/v3/client/web"
	_ "github.com/micro/micro/v3/cmd/server"
	_ "github.com/micro/micro/v3/cmd/service"

	// load platform profile
	_ "m3o.dev/platform/profile"
)

func main() {
	cmd.Run()
}
