package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	"github.com/micro/micro/v3/service/store"

	otp "m3o.dev/services/otp/proto"
	adminpb "m3o.dev/services/pkg/service/proto"
	"m3o.dev/services/pkg/tracing"
	"m3o.dev/services/user/handler"
	proto "m3o.dev/services/user/proto"
)

func main() {
	srv := service.New(
		service.Name("user"),
	)
	srv.Init()

	hd := handler.NewUser(
		store.DefaultStore,
		otp.NewOtpService("otp", srv.Client()),
	)

	proto.RegisterUserHandler(srv.Server(), hd)
	adminpb.RegisterAdminHandler(srv.Server(), hd)
	traceCloser := tracing.SetupOpentracing("user")
	defer traceCloser.Close()

	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
