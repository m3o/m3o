package cli

import (
	"fmt"

	"github.com/urfave/cli/v2"
	"m3o.dev/platform/cli/namespace"
	"m3o.dev/platform/cli/util"
	pb "m3o.dev/platform/proto/store"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/context"
)

// databases is the entrypoint for micro store databases
func databases(ctx *cli.Context) error {
	dbReq := client.NewRequest(ctx.String("store"), "Store.Databases", &pb.DatabasesRequest{})
	dbRsp := &pb.DatabasesResponse{}
	if err := client.DefaultClient.Call(context.DefaultContext, dbReq, dbRsp, client.WithAuthToken()); err != nil {
		return err
	}
	for _, db := range dbRsp.Databases {
		fmt.Println(db)
	}
	return nil
}

// tables is the entrypoint for micro store tables
func tables(ctx *cli.Context) error {
	env, err := util.GetEnv(ctx)
	if err != nil {
		return err
	}
	ns, err := namespace.Get(env.Name)
	if err != nil {
		return err
	}

	tReq := client.NewRequest(ctx.String("store"), "Store.Tables", &pb.TablesRequest{
		Database: ns,
	})
	tRsp := &pb.TablesResponse{}
	if err := client.DefaultClient.Call(context.DefaultContext, tReq, tRsp, client.WithAuthToken()); err != nil {
		return err
	}
	for _, table := range tRsp.Tables {
		fmt.Println(table)
	}
	return nil
}
