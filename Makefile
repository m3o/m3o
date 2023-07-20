NAME=micro

all: platform

platform:
	go build -a -installsuffix cgo -o $(NAME) ./platform/main.go

.PHONY: platform 
