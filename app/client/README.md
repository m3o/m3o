# M3O API Client [![godoc](https://godoc.org/github.com/m3o/m3o/api/client?status.svg)](https://godoc.org/github.com/m3o/m3o/api/client) 

This is the Go client to access APIs on the M3O Platform

## Usage

```go
package main

import (
    "fmt"
    "os"

    "m3o.dev/api/client"
)

type Request struct {
	Name string `json:"name"`
}

type Response struct {
	Message string `json:"message"`
}

var (
	token = os.Getenv("TOKEN")
)

func main() {
	c := client.NewClient(nil)

	// set your api token
	c.SetToken(token)

   	req := &Request{
		Name: "John",
	}
	
	var rsp Response

	if err := c.Call("helloworld", "call", req, &rsp); err != nil {
		fmt.Println(err)
		return
	}
	
	fmt.Println(rsp)
}
```

## Streaming

The client supports streaming

```go
package main

import (
	"fmt"

	"m3o.dev/api/client"
)

type Request struct {
	Count string `json:"count"`
}

type Response struct {
	Count string `json:"count"`
}

var (
	token, _ = os.Getenv("TOKEN")
)

func main() {
	c := client.NewClient(nil)

	// set your api token
	c.SetToken(token)
	
	stream, err := c.Stream("streams", "subscribe", Request{Count: "10"})
	if err != nil {
		fmt.Println(err)
		return
	}

	for {
		var rsp Response
		if err := stream.Recv(&rsp); err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println("got", rsp.Count)
	}
}
```

