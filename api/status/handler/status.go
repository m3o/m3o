package handler

import (
	"context"
	"encoding/json"
	"fmt"

	api "m3o.dev/platform/proto/api"
	proto "m3o.dev/platform/proto/debug"
	"m3o.dev/platform/service/client"
	goclient "m3o.dev/platform/service/client"
	"m3o.dev/platform/service/errors"
	status "m3o.dev/api/status/proto/status"
)

var (
	defaultServices = []string{
		"api", // If this is down then this wouldn't even get routed to...
		"auth",
		"broker",
		"config",
		"debug",
		"network",
		"proxy",
		"registry",
		"runtime",
		"store",
	}
)

type Status struct {
	monitoredServices []string
}

// NewStatusHandler returns a status handler configured to report the status of the given services
func NewStatusHandler(services []string) status.StatusHandler {
	svcs := defaultServices
	if len(services) > 0 {
		svcs = services
	}
	return &Status{monitoredServices: svcs}
}

// Call is called by the API as /status/call with post body {"name": "foo"}
func (e *Status) Call(ctx context.Context, req *api.Request, rsp *api.Response) error {
	response := map[string]string{}
	overallOK := true

	// Are the services up?
	for _, serverName := range e.monitoredServices {
		req := client.NewRequest(serverName, "Debug.Health", &proto.HealthRequest{})
		rsp := &proto.HealthResponse{}

		err := client.DefaultClient.Call(context.TODO(), req, rsp, goclient.WithAuthToken())
		status := "OK"
		if err != nil || rsp.Status != "ok" {
			status = "NOT_HEALTHY"
			if rsp != nil && rsp.Status != "" {
				status = rsp.Status
			}
			if err != nil {
				status = fmt.Sprintf("%s %s", status, err.Error())
			}
			overallOK = false
		}
		response[serverName] = status
	}

	b, _ := json.Marshal(response)
	if !overallOK {
		rsp.StatusCode = 500
		rsp.Body = string(b)
		return errors.New("status.error", rsp.Body, rsp.StatusCode)
	}
	rsp.StatusCode = 200
	rsp.Body = string(b)

	return nil
}
