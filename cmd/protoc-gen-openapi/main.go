package main

import (
	"fmt"
	"log"
	"os"

	"github.com/golang/protobuf/proto"
	plugin "github.com/golang/protobuf/protoc-gen-go/plugin"
	"github.com/m3o/m3o/cmd/protoc-gen-openapi/converter"
)

func main() {

	// Get a converter:
	protoConverter := converter.New()

	// Convert the generator request:
	var ok = true
	log.Printf("Processing code generator request")
	res, err := protoConverter.ConvertFrom(os.Stdin)
	if err != nil {
		ok = false
		if res == nil {
			message := fmt.Sprintf("Failed to read input: %v", err)
			res = &plugin.CodeGeneratorResponse{
				Error: &message,
			}
		}
	}

	log.Print("Serializing code generator response")
	data, err := proto.Marshal(res)
	if err != nil {
		log.Fatalf("Cannot marshal response: %v", err)
	}
	_, err = os.Stdout.Write(data)
	if err != nil {
		log.Fatalf("Failed to write response: %v", err)
	}

	if ok {
		log.Print("Succeeded to process code generator request")
	} else {
		log.Print("Failed to process code generator but successfully sent the error to protoc")
		os.Exit(1)
	}
}
