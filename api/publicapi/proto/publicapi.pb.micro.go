// Code generated by protoc-gen-micro. DO NOT EDIT.
// source: proto/publicapi.proto

package publicapi

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

import (
	context "context"
	api "m3o.dev/platform/service/api"
	client "m3o.dev/platform/service/client"
	server "m3o.dev/platform/service/server"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

// Reference imports to suppress errors if they are not otherwise used.
var _ api.Endpoint
var _ context.Context
var _ client.Option
var _ server.Option

// Api Endpoints for Publicapi service

func NewPublicapiEndpoints() []*api.Endpoint {
	return []*api.Endpoint{}
}

// Client API for Publicapi service

type PublicapiService interface {
	Publish(ctx context.Context, in *PublishRequest, opts ...client.CallOption) (*PublishResponse, error)
	Update(ctx context.Context, in *UpdateRequest, opts ...client.CallOption) (*UpdateResponse, error)
	Get(ctx context.Context, in *GetRequest, opts ...client.CallOption) (*GetResponse, error)
	List(ctx context.Context, in *ListRequest, opts ...client.CallOption) (*ListResponse, error)
	Remove(ctx context.Context, in *RemoveRequest, opts ...client.CallOption) (*RemoveResponse, error)
}

type publicapiService struct {
	c    client.Client
	name string
}

func NewPublicapiService(name string, c client.Client) PublicapiService {
	return &publicapiService{
		c:    c,
		name: name,
	}
}

func (c *publicapiService) Publish(ctx context.Context, in *PublishRequest, opts ...client.CallOption) (*PublishResponse, error) {
	req := c.c.NewRequest(c.name, "Publicapi.Publish", in)
	out := new(PublishResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicapiService) Update(ctx context.Context, in *UpdateRequest, opts ...client.CallOption) (*UpdateResponse, error) {
	req := c.c.NewRequest(c.name, "Publicapi.Update", in)
	out := new(UpdateResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicapiService) Get(ctx context.Context, in *GetRequest, opts ...client.CallOption) (*GetResponse, error) {
	req := c.c.NewRequest(c.name, "Publicapi.Get", in)
	out := new(GetResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicapiService) List(ctx context.Context, in *ListRequest, opts ...client.CallOption) (*ListResponse, error) {
	req := c.c.NewRequest(c.name, "Publicapi.List", in)
	out := new(ListResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicapiService) Remove(ctx context.Context, in *RemoveRequest, opts ...client.CallOption) (*RemoveResponse, error) {
	req := c.c.NewRequest(c.name, "Publicapi.Remove", in)
	out := new(RemoveResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for Publicapi service

type PublicapiHandler interface {
	Publish(context.Context, *PublishRequest, *PublishResponse) error
	Update(context.Context, *UpdateRequest, *UpdateResponse) error
	Get(context.Context, *GetRequest, *GetResponse) error
	List(context.Context, *ListRequest, *ListResponse) error
	Remove(context.Context, *RemoveRequest, *RemoveResponse) error
}

func RegisterPublicapiHandler(s server.Server, hdlr PublicapiHandler, opts ...server.HandlerOption) error {
	type publicapi interface {
		Publish(ctx context.Context, in *PublishRequest, out *PublishResponse) error
		Update(ctx context.Context, in *UpdateRequest, out *UpdateResponse) error
		Get(ctx context.Context, in *GetRequest, out *GetResponse) error
		List(ctx context.Context, in *ListRequest, out *ListResponse) error
		Remove(ctx context.Context, in *RemoveRequest, out *RemoveResponse) error
	}
	type Publicapi struct {
		publicapi
	}
	h := &publicapiHandler{hdlr}
	return s.Handle(s.NewHandler(&Publicapi{h}, opts...))
}

type publicapiHandler struct {
	PublicapiHandler
}

func (h *publicapiHandler) Publish(ctx context.Context, in *PublishRequest, out *PublishResponse) error {
	return h.PublicapiHandler.Publish(ctx, in, out)
}

func (h *publicapiHandler) Update(ctx context.Context, in *UpdateRequest, out *UpdateResponse) error {
	return h.PublicapiHandler.Update(ctx, in, out)
}

func (h *publicapiHandler) Get(ctx context.Context, in *GetRequest, out *GetResponse) error {
	return h.PublicapiHandler.Get(ctx, in, out)
}

func (h *publicapiHandler) List(ctx context.Context, in *ListRequest, out *ListResponse) error {
	return h.PublicapiHandler.List(ctx, in, out)
}

func (h *publicapiHandler) Remove(ctx context.Context, in *RemoveRequest, out *RemoveResponse) error {
	return h.PublicapiHandler.Remove(ctx, in, out)
}
