package main

import (
        "github.com/micro/micro/v3/cmd"

        // load packages so they can register commands
        _ "github.com/micro/micro/v3/client/cli"
        _ "github.com/micro/micro/v3/client/web"
        _ "github.com/micro/micro/v3/cmd/server"
        _ "github.com/micro/micro/v3/cmd/service"
        _ "github.com/micro/micro/v3/cmd/usage"

	// load platform profile
	_ "github.com/micro/micro/profile/platform"

	// load the v1 handler
	"m3o.dev/api/v1/plugin"
)

func main() {
	// register the v1 plugin
	plugin.Register()

        cmd.Run()
}


