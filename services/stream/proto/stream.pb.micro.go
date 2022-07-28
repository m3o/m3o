// Code generated by protoc-gen-micro. DO NOT EDIT.
// source: proto/stream.proto

package stream

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

// Api Endpoints for Stream service

func NewStreamEndpoints() []*api.Endpoint {
	return []*api.Endpoint{}
}

// Client API for Stream service

type StreamService interface {
	CreateChannel(ctx context.Context, in *CreateChannelRequest, opts ...client.CallOption) (*CreateChannelResponse, error)
	SendMessage(ctx context.Context, in *SendMessageRequest, opts ...client.CallOption) (*SendMessageResponse, error)
	ListMessages(ctx context.Context, in *ListMessagesRequest, opts ...client.CallOption) (*ListMessagesResponse, error)
	ListChannels(ctx context.Context, in *ListChannelsRequest, opts ...client.CallOption) (*ListChannelsResponse, error)
}

type streamService struct {
	c    client.Client
	name string
}

func NewStreamService(name string, c client.Client) StreamService {
	return &streamService{
		c:    c,
		name: name,
	}
}

func (c *streamService) CreateChannel(ctx context.Context, in *CreateChannelRequest, opts ...client.CallOption) (*CreateChannelResponse, error) {
	req := c.c.NewRequest(c.name, "Stream.CreateChannel", in)
	out := new(CreateChannelResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *streamService) SendMessage(ctx context.Context, in *SendMessageRequest, opts ...client.CallOption) (*SendMessageResponse, error) {
	req := c.c.NewRequest(c.name, "Stream.SendMessage", in)
	out := new(SendMessageResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *streamService) ListMessages(ctx context.Context, in *ListMessagesRequest, opts ...client.CallOption) (*ListMessagesResponse, error) {
	req := c.c.NewRequest(c.name, "Stream.ListMessages", in)
	out := new(ListMessagesResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *streamService) ListChannels(ctx context.Context, in *ListChannelsRequest, opts ...client.CallOption) (*ListChannelsResponse, error) {
	req := c.c.NewRequest(c.name, "Stream.ListChannels", in)
	out := new(ListChannelsResponse)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for Stream service

type StreamHandler interface {
	CreateChannel(context.Context, *CreateChannelRequest, *CreateChannelResponse) error
	SendMessage(context.Context, *SendMessageRequest, *SendMessageResponse) error
	ListMessages(context.Context, *ListMessagesRequest, *ListMessagesResponse) error
	ListChannels(context.Context, *ListChannelsRequest, *ListChannelsResponse) error
}

func RegisterStreamHandler(s server.Server, hdlr StreamHandler, opts ...server.HandlerOption) error {
	type stream interface {
		CreateChannel(ctx context.Context, in *CreateChannelRequest, out *CreateChannelResponse) error
		SendMessage(ctx context.Context, in *SendMessageRequest, out *SendMessageResponse) error
		ListMessages(ctx context.Context, in *ListMessagesRequest, out *ListMessagesResponse) error
		ListChannels(ctx context.Context, in *ListChannelsRequest, out *ListChannelsResponse) error
	}
	type Stream struct {
		stream
	}
	h := &streamHandler{hdlr}
	return s.Handle(s.NewHandler(&Stream{h}, opts...))
}

type streamHandler struct {
	StreamHandler
}

func (h *streamHandler) CreateChannel(ctx context.Context, in *CreateChannelRequest, out *CreateChannelResponse) error {
	return h.StreamHandler.CreateChannel(ctx, in, out)
}

func (h *streamHandler) SendMessage(ctx context.Context, in *SendMessageRequest, out *SendMessageResponse) error {
	return h.StreamHandler.SendMessage(ctx, in, out)
}

func (h *streamHandler) ListMessages(ctx context.Context, in *ListMessagesRequest, out *ListMessagesResponse) error {
	return h.StreamHandler.ListMessages(ctx, in, out)
}

func (h *streamHandler) ListChannels(ctx context.Context, in *ListChannelsRequest, out *ListChannelsResponse) error {
	return h.StreamHandler.ListChannels(ctx, in, out)
}
