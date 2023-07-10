
GOPATH:=$(shell go env GOPATH)
MODIFY=Mproto/imports/api.proto=m3o.dev/platform/proto/api

.PHONY: proto
proto:
    
	protoc --proto_path=. --micro_out=${MODIFY}:. --go_out=${MODIFY}:. proto/status/status.proto
    

.PHONY: build
build: proto

	go build -o status-api *.go

.PHONY: test
test:
	go test -v ./... -cover

.PHONY: docker
docker:
	docker build . -t status-api:latest
