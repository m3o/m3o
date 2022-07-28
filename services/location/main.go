package main

import (
	"log"

	"github.com/micro/micro/v3/service"
	"github.com/m3o/m3o/services/location/handler"
	pb "github.com/m3o/m3o/services/location/proto"
	admin "github.com/m3o/m3o/services/pkg/service/proto"
	"github.com/m3o/m3o/services/pkg/tracing"
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
