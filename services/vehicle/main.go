package main

import (
	"m3o.dev/services/vehicle/handler"
	pb "m3o.dev/services/vehicle/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("vehicle"),
		service.Version("latest"),
	)

	v, err := config.Get("vehicle.api_key")
	if err != nil {
		logger.Fatalf("vehicle.api_key config not found: %v", err)
	}
	key := v.String("")
	if len(key) == 0 {
		logger.Fatal("vehicle.api_key config not found")
	}

	h := handler.New(key)
	// Register handler
	pb.RegisterVehicleHandler(srv.Server(), h)
	pb.RegisterVehicleAdminHandler(srv.Server(), h)

	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
