// Code generated by protoc-gen-micro. DO NOT EDIT.
// source: proto/url.proto

package url

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

import (
	context "context"
	api "github.com/micro/micro/v3/service/api"
	client "github.com/micro/micro/v3/service/client"
	server "github.com/micro/micro/v3/service/server"
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

// Api Endpoints for Url service

func NewUrlEndpoints() []*api.Endpoint {
	return []*api.Endpoint{}
}

// Client API for Url service

type UrlService interface {
	Shorten(ctx context.Context, in *ShortenRequest, opts ...client.CallOption) (*ShortenResponse, error)
	List(ctx context.Context, in *ListRequest, opts ...client.CallOption) (*ListResponse, error)
	Proxy(ctx context.Context, in *ProxyRequest, opts ...client.CallOption) (*ProxyResponse, error)
}

type urlService struct {
	c    client.Client
	name string
}

func NewUrlService(name string, c client.Client) UrlService {
	return &urlService{
		c:    c,
		name: name,
	}
}

func (c *urlService) Shorten(ctx context.Context, in *ShortenRequest, opts ...client.CallOption) (*ShortenResponse, error) {
	req := c.c.NewRequest(c.name, "Url.Shorten", in)
	out := new(ShortenResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *urlService) List(ctx context.Context, in *ListRequest, opts ...client.CallOption) (*ListResponse, error) {
	req := c.c.NewRequest(c.name, "Url.List", in)
	out := new(ListResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *urlService) Proxy(ctx context.Context, in *ProxyRequest, opts ...client.CallOption) (*ProxyResponse, error) {
	req := c.c.NewRequest(c.name, "Url.Proxy", in)
	out := new(ProxyResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for Url service

type UrlHandler interface {
	Shorten(context.Context, *ShortenRequest, *ShortenResponse) error
	List(context.Context, *ListRequest, *ListResponse) error
	Proxy(context.Context, *ProxyRequest, *ProxyResponse) error
}

func RegisterUrlHandler(s server.Server, hdlr UrlHandler, opts ...server.HandlerOption) error {
	type url interface {
		Shorten(ctx context.Context, in *ShortenRequest, out *ShortenResponse) error
		List(ctx context.Context, in *ListRequest, out *ListResponse) error
		Proxy(ctx context.Context, in *ProxyRequest, out *ProxyResponse) error
	}
	type Url struct {
		url
	}
	h := &urlHandler{hdlr}
	return s.Handle(s.NewHandler(&Url{h}, opts...))
}

type urlHandler struct {
	UrlHandler
}

func (h *urlHandler) Shorten(ctx context.Context, in *ShortenRequest, out *ShortenResponse) error {
	return h.UrlHandler.Shorten(ctx, in, out)
}

func (h *urlHandler) List(ctx context.Context, in *ListRequest, out *ListResponse) error {
	return h.UrlHandler.List(ctx, in, out)
}

func (h *urlHandler) Proxy(ctx context.Context, in *ProxyRequest, out *ProxyResponse) error {
	return h.UrlHandler.Proxy(ctx, in, out)
}
