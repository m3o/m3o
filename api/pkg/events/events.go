package events

import (
	"fmt"
	"time"

	mevents "m3o.dev/platform/service/events"
	"m3o.dev/platform/service/logger"
)

func ProcessTopic(topic, groupPrefix string, handler func(ev mevents.Event) error) {
	var evs <-chan mevents.Event
	start := time.Now()
	for {
		var err error
		evs, err = mevents.Consume(topic,
			mevents.WithAutoAck(false, 30*time.Second),
			mevents.WithRetryLimit(10),
			mevents.WithGroup(fmt.Sprintf("%s-%s", groupPrefix, topic))) // 10 retries * 30 secs ackWait gives us 5 mins of tolerance for issues
		if err == nil {
			logger.Infof("Starting to process %s events", topic)
			processEvents(evs, handler)
			start = time.Now()
			continue // if for some reason evs closes we loop and try subscribing again
		}
		// TODO fix me
		if time.Since(start) > 2*time.Minute {
			logger.Fatalf("Failed to subscribe to topic %s: %s", topic, err)
		}
		logger.Warnf("Unable to subscribe to topic %s. Will retry in 20 secs. %s", topic, err)
		time.Sleep(20 * time.Second)
	}
}

func processEvents(ch <-chan mevents.Event, handler func(ev mevents.Event) error) {
	timeout := 60 * time.Minute
	t := time.NewTimer(timeout)
	for {
		var ev mevents.Event
		select {
		case ev = <-ch:
			if !t.Stop() {
				<-t.C
			}
			if len(ev.ID) == 0 {
				// channel closed
				logger.Infof("Channel closed, retrying stream connection")
				return
			}
		case <-t.C:
			// safety net in case we stop receiving messages for some reason
			logger.Fatalf("No messages received for last 60 minutes retrying connection")
		}
		t.Reset(timeout)
		if err := handler(ev); err != nil {
			ev.Nack()
			continue
		}
		ev.Ack()
	}
}
