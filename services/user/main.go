package main

import (
	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
	db "github.com/m3o/m3o/services/db/proto"
	otp "github.com/m3o/m3o/services/otp/proto"
	"github.com/m3o/m3o/services/pkg/tracing"
	"github.com/m3o/m3o/services/user/handler"
	proto "github.com/m3o/m3o/services/user/proto"
)

func main() {
	service := service.New(
		service.Name("user"),
	)
	service.Init()

	hd := handler.NewUser(
		db.NewDbService("db", service.Client()),
		otp.NewOtpService("otp", service.Client()),
	)

	proto.RegisterUserHandler(service.Server(), hd)
	traceCloser := tracing.SetupOpentracing("user")
	defer traceCloser.Close()

	if err := service.Run(); err != nil {
		logger.Fatal(err)
	}
}
