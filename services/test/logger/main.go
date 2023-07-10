package main

import (
	"time"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/logger"
)

func main() {
	go func() {
		for {
			logger.Infof("This is a log line %s", time.Now())
			time.Sleep(1 * time.Second)
		}
	}()

	service.Run()
}
