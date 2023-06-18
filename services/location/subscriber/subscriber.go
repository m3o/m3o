package subscriber

import (
	"context"
	"log"

	"m3o.dev/services/location/domain"
	proto "m3o.dev/services/location/proto"
)

var (
	Topic = "location"
)

type Location struct{}

func (g *Location) Handle(ctx context.Context, e *proto.Entity) error {
	log.Printf("Saving entity ID %s", e.Id)
	domain.Save(ctx, domain.ProtoToEntity(e))
	return nil
}
