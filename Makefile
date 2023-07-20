NAME=micro

all: build

build:
	go build -a -installsuffix cgo -o $(NAME) ./platform/main.go

.PHONY: build
