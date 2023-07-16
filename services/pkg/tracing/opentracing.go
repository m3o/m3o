package tracing

import (
	"io"

	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/logger"
	"m3o.dev/platform/util/opentelemetry"
	"m3o.dev/platform/util/opentelemetry/jaeger"
)

func SetupOpentracing(serviceName string) io.Closer {
	c, _ := config.Get("jaegeraddress")
	openTracer, closer, err := jaeger.New(
		opentelemetry.WithServiceName(serviceName),
		opentelemetry.WithTraceReporterAddress(c.String("localhost:6831")),
	)
	if err != nil {
		logger.Fatalf("Error configuring opentracing: %v", err)
	}
	logger.Infof("Configured jaeger to %s", c.String("localhost:6831"))

	opentelemetry.DefaultOpenTracer = openTracer
	return closer
}
