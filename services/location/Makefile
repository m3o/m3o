
GOPATH:=$(shell go env GOPATH)
.PHONY: init
init:
	go get -u github.com/golang/protobuf/proto
	go get -u github.com/golang/protobuf/protoc-gen-go
	go get m3o.dev/platform/cmd/protoc-gen-micro
	go get m3o.dev/platform/cmd/protoc-gen-openapi
.PHONY: proto
proto:
	protoc --openapi_out=. --proto_path=. --micro_out=. --go_out=:. proto/location.proto

.PHONY: api
api:
	protoc --openapi_out=. --proto_path=. proto/location.proto

.PHONY: build
build:
	go build -o location *.go

.PHONY: test
test:
	go test -v ./... -cover

.PHONY: docker
docker:
	docker build . -t location:latest
