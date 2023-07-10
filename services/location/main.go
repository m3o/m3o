package main

import (
	"log"

	"m3o.dev/platform/service"
	"m3o.dev/services/location/handler"
	pb "m3o.dev/services/location/proto"
	admin "m3o.dev/services/pkg/service/proto"
	"m3o.dev/services/pkg/tracing"
)

func main() {
	location := service.New(
		service.Name("location"),
	)

	h := new(handler.Location)
	pb.RegisterLocationHandler(location.Server(), h)
	admin.RegisterAdminHandler(location.Server(), h)

	// TODO reinstate me
	//service.Subscribe(subscriber.Topic, new(subscriber.Location))
	traceCloser := tracing.SetupOpentracing("location")
	defer traceCloser.Close()

	if err := location.Run(); err != nil {
		log.Fatal(err)
	}
}
