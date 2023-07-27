
GOPATH:=$(shell go env GOPATH)
.PHONY: init
init:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install m3o.dev/platform/cmd/protoc-gen-m3o@latest
	go install m3o.dev/platform/cmd/protoc-gen-openapi@latest

.PHONY: api
api:
	protoc --openapi_out=. --proto_path=. proto/ai.proto

.PHONY: proto
proto:
	protoc --proto_path=. --m3o_out=. --go_out=:. proto/ai.proto
	
.PHONY: build
build:
	go build -o ai *.go

.PHONY: test
test:
	go test -v ./... -cover

.PHONY: docker
docker:
	docker build . -t ai:latest
