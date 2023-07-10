package util

import (
	"time"

	pb "m3o.dev/platform/proto/events"
	"m3o.dev/platform/service/events"
)

func SerializeEvent(ev *events.Event) *pb.Event {
	return &pb.Event{
		Id:        ev.ID,
		Topic:     ev.Topic,
		Metadata:  ev.Metadata,
		Payload:   ev.Payload,
		Timestamp: ev.Timestamp.Unix(),
	}
}

func DeserializeEvent(ev *pb.Event) events.Event {
	return events.Event{
		ID:        ev.Id,
		Topic:     ev.Topic,
		Metadata:  ev.Metadata,
		Payload:   ev.Payload,
		Timestamp: time.Unix(ev.Timestamp, 0),
	}
}
