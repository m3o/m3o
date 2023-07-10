package debug

import (
	"m3o.dev/platform/service/debug/log"
	memLog "m3o.dev/platform/service/debug/log/memory"
	"m3o.dev/platform/service/debug/profile"
	"m3o.dev/platform/service/debug/stats"
	memStats "m3o.dev/platform/service/debug/stats/memory"
	"m3o.dev/platform/service/debug/trace"
	memTrace "m3o.dev/platform/service/debug/trace/memory"
)

var (
	DefaultLog      log.Log         = memLog.NewLog()
	DefaultTracer   trace.Tracer    = memTrace.NewTracer()
	DefaultStats    stats.Stats     = memStats.NewStats()
	DefaultProfiler profile.Profile = nil
)
