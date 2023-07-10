package main

import (
	"m3o.dev/platform/service/store"
	admin "m3o.dev/services/pkg/service/proto"

	"m3o.dev/services/contact/domain"
	"m3o.dev/services/contact/handler"
	pb "m3o.dev/services/contact/proto"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	// Create service
	srv := service.New(
		service.Name("contact"),
		service.Version("latest"),
	)

	contactDomain := domain.NewContactDomain(store.DefaultStore)

	h := handler.NewContact(contactDomain)
	// Register handler
	pb.RegisterContactHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)
	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
