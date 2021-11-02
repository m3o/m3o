package main

import (
	"fmt"
	"os"

	"go.m3o.com/client"
)

type StreamService struct {
	client *client.Client
}

type SubscribeRequest struct {
	Topic string `json:"topic"`
}

type SubscribeResponse struct {
	Topic   string      `json:"topic"`
	Message interface{} `json:"message"`
}

type StreamSubscribeStream struct {
	stream *client.Stream
}

func (s *StreamService) Subscribe(req *SubscribeRequest) (*StreamSubscribeStream, error) {
	stream, err := s.client.Stream("stream", "Subscribe", req)
	if err != nil {
		return nil, err
	}
	return &StreamSubscribeStream{
		stream: stream,
	}, nil
}

func (s *StreamSubscribeStream) Recv() (*SubscribeResponse, error) {
	var rsp SubscribeResponse
	if err := s.stream.Recv(&rsp); err != nil {
		return nil, err
	}
	return &rsp, nil
}

func NewStreamService(token string) *StreamService {
	c := client.NewClient(nil)
	c.SetToken(token)

	return &StreamService{
		client: c,
	}
}

func main() {
	stream := NewStreamService(os.Getenv("M3O_API_TOKEN"))

	sub, err := stream.Subscribe(&SubscribeRequest{Topic: "example"})
	if err != nil {
		fmt.Println(err)
		return
	}

	for {
		fmt.Println("waiting for message")

		// get a message
		rsp, err := sub.Recv()
		if err != nil {
			fmt.Println(err)
			return
		}

		fmt.Printf("got %+v\n", rsp.Message)
	}

}
