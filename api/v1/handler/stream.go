// // Copyright 2020 Asim Aslam
// //
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //     https://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.
// //
// // Original source: github.com/micro/go-micro/v3/api/handler/rpc/stream.go
package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
	"m3o.dev/platform/service/client"
	"m3o.dev/platform/service/context/metadata"
	"m3o.dev/platform/service/errors"
	"m3o.dev/platform/service/logger"
	"m3o.dev/platform/service/registry"
	"m3o.dev/platform/service/router"
	"m3o.dev/platform/service/server"
)

type rawFrame struct {
	Data []byte
}

func serveStream(ctx context.Context, stream server.Stream, service, endpoint string, svcs []*registry.Service, apiRec *apiKeyRecord, price string) error {
	// serve as websocket if that's the case
	md, ok := metadata.FromContext(ctx)
	if !ok {
		return errInternal
	}
	if isWebSocket(md) {
		return serveWebsocket(ctx, stream, service, endpoint, svcs, apiRec, price)
	}

	// otherwise serve the stream as http long poll

	ct, _ := md.Get("Content-Type")
	// Strip charset from Content-Type (like `application/json; charset=UTF-8`)
	ct = parseContentType(ct)

	var payload json.RawMessage
	if err := stream.Recv(&payload); err != nil {
		logger.Errorf("Error receiving from stream %s", err)
		return errInternal
	}

	var request interface{}
	if !bytes.Equal(payload, []byte(`{}`)) {
		switch ct {
		case "application/json", "application/grpc+json", "":
			m := payload
			request = &m
		default:
			request = &rawFrame{Data: payload}
		}
	}

	req := client.DefaultClient.NewRequest(
		service,
		endpoint,
		request,
		client.WithContentType(ct),
		client.StreamingRequest(),
	)

	// specify the nodes
	var nodes []string
	for _, service := range svcs {
		for _, node := range service.Nodes {
			nodes = append(nodes, node.Address)
		}
	}

	// create custom router
	callOpt := client.WithAddress(nodes...)

	// create a new stream
	downStream, err := client.DefaultClient.Stream(ctx, req, callOpt)
	if err != nil {
		logger.Errorf("Error creating new stream %s", err)
		return errInternal
	}
	defer downStream.Close()

	if err = downStream.Send(request); err != nil {
		logger.Error(err)
		return errInternal
	}

	reqURL, _ := md.Get("url")
	// http long poll
	publishEndpointEvent(reqURL, service, endpoint, apiRec, price)

	rsp := downStream.Response()

	// receive from stream and send to client
	for {
		select {
		case <-ctx.Done():
			return nil
		case <-downStream.Context().Done():
			return nil
		default:
			// read backend response body
			buf, err := rsp.Read()
			if err != nil {
				// wants to avoid import grpc/status.Status
				if strings.Contains(err.Error(), "context canceled") {
					return nil
				}
				// end of stream
				if err == io.EOF {
					return nil
				}
				logger.Error(err)
				return errInternal
			}

			// TODO don't assume json
			err = stream.Send(json.RawMessage(buf))
			// send the buffer
			if err != nil {
				logger.Error(err)
			}
		}
	}
}

// serveWebsocket will stream rpc back over websockets assuming json
func serveWebsocket(ctx context.Context, serverStream server.Stream, service, endpoint string, svcs []*registry.Service, apiRec *apiKeyRecord, price string) error {
	md, ok := metadata.FromContext(ctx)
	if !ok {
		return errors.InternalServerError("v1", "Error processing request")
	}
	ct, _ := md.Get("Content-Type")
	ct = parseContentType(ct)

	// create stream
	req := client.DefaultClient.NewRequest(
		service,
		endpoint,
		nil,
		client.WithContentType(ct),
		client.StreamingRequest(),
	)

	// create a new stream
	downstream, err := client.DefaultClient.Stream(ctx, req, client.WithRouter(newRouter(svcs)))
	if err != nil {
		logger.Error(err)
		return errInternal
	}
	defer downstream.Close()

	// determine the message type
	msgType := websocket.BinaryMessage
	if ct == "application/json" || ct == "application/grpc+json" {
		msgType = websocket.TextMessage
	}

	s := stream{
		ctx:          ctx,
		serverStream: serverStream,
		stream:       downstream,
		messageType:  msgType,
		apiRec:       apiRec,
		service:      service,
		endpoint:     endpoint,
		price:        price,
	}
	s.processWSReadsAndWrites()
	return nil

}

type stream struct {
	// message type requested (binary or text)
	messageType int
	// request context
	ctx context.Context
	// the websocket connection.
	serverStream server.Stream
	// the downstream connection.
	stream client.Stream
	// the apiKeyRecord for this user
	apiRec *apiKeyRecord

	service  string
	endpoint string
	price    string
}

func (s *stream) processWSReadsAndWrites() {
	defer func() {
		s.serverStream.Close()
		s.stream.Close()
	}()

	stopCtx, cancel := context.WithCancel(context.Background())
	wg := sync.WaitGroup{}
	wg.Add(3)
	msgs := make(chan []byte)
	go s.rspToBufLoop(cancel, &wg, stopCtx, msgs)
	go s.bufToClientLoop(cancel, &wg, stopCtx, msgs)
	go s.clientToServerLoop(cancel, &wg, stopCtx)
	wg.Wait()
}

func (s *stream) rspToBufLoop(cancel context.CancelFunc, wg *sync.WaitGroup, stopCtx context.Context, msgs chan []byte) {
	defer func() {
		cancel()
		wg.Done()
	}()

	rsp := s.stream.Response()
	for {
		select {
		case <-stopCtx.Done():
			return
		default:
		}
		bytes, err := rsp.Read()
		if err != nil {
			return
		}
		select {
		case <-stopCtx.Done():
			return
		case msgs <- bytes:
		}

	}

}

func (s *stream) bufToClientLoop(cancel context.CancelFunc, wg *sync.WaitGroup, stopCtx context.Context, msgs chan []byte) {
	defer func() {
		cancel()
		wg.Done()
	}()
	for {
		select {
		case <-stopCtx.Done():
			return
		case <-s.ctx.Done():
			return
		case <-s.stream.Context().Done():
			return
		case msg := <-msgs:
			// read response body
			// TODO don't assume json
			if err := s.serverStream.Send(json.RawMessage(msg)); err != nil {
				logger.Errorf("Error sending to stream %s", err)
				return
			}
		}
	}
}

func (s *stream) clientToServerLoop(cancel context.CancelFunc, wg *sync.WaitGroup, stopCtx context.Context) {
	defer func() {
		cancel()
		wg.Done()
	}()

	md, _ := metadata.FromContext(s.ctx)
	reqURL, _ := md.Get("url")
	ch := make(chan interface{})
	go func() {
		defer close(ch)
		for {
			var request interface{}
			switch s.messageType {
			case websocket.TextMessage:
				request = &json.RawMessage{}
				if err := s.serverStream.Recv(request); err != nil {
					logger.Errorf("Error receiving from stream %s", err)
					return
				}
			default:
				var b []byte
				if err := s.serverStream.Recv(b); err != nil {
					logger.Errorf("Error receiving from stream %s", err)
					return
				}
				request = &rawFrame{Data: b}
			}
			ch <- request
		}
	}()

	for {
		var request interface{}
		select {
		case <-stopCtx.Done():
			return
		case request = <-ch:
			if request == nil {
				return
			}
		}

		if err := s.stream.Send(request); err != nil {
			logger.Error(err)
			return
		}
		publishEndpointEvent(reqURL, s.service, s.endpoint, s.apiRec, s.price)
	}
}

func isStream(svcName string, svcs []*registry.Service) bool {
	// check if the endpoint supports streaming
	for _, service := range svcs {
		for _, ep := range service.Endpoints {
			// skip if it doesn't match the name
			if ep.Name != svcName {
				continue
			}
			// matched if the name
			if v := ep.Metadata["stream"]; v == "true" {
				return true
			}
		}
	}

	return false
}

func isWebSocket(md metadata.Metadata) bool {
	conn, _ := md.Get("Connection")
	up, _ := md.Get("Upgrade")
	return strings.ToLower(conn) == "upgrade" && strings.ToLower(up) == "websocket"
}

type apiRouter struct {
	routes []router.Route
	router.Router
}

func (r *apiRouter) Lookup(service string, opts ...router.LookupOption) ([]router.Route, error) {
	return r.routes, nil
}

func (r *apiRouter) String() string {
	return "api"
}

// Router is a hack for API routing
func newRouter(srvs []*registry.Service) router.Router {
	var routes []router.Route

	for _, srv := range srvs {
		for _, n := range srv.Nodes {
			routes = append(routes, router.Route{Address: n.Address, Metadata: n.Metadata})
		}
	}

	return &apiRouter{routes: routes}
}
