package main

import (
	"m3o.dev/api/twilio/handler"
	pb "m3o.dev/api/twilio/proto"

	"github.com/micro/micro/v3/service"
	"github.com/micro/micro/v3/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("sms"),
	)

	// Register handler
	pb.RegisterTwilioHandler(srv.Server(), new(handler.Twilio))

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
