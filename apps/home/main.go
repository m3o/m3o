package main

import (
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"m3o.dev/apps/home/handler"
	"m3o.dev/apps/home/server"
)

func main() {
	// the home server
	srv := server.New()

	// new handler
	hdr := handler.New(srv)

	// register handler
	http.Handle("/", handlers.CombinedLoggingHandler(os.Stdout, hdr))

	// run on port 8080
	http.ListenAndServe(":8080", nil)
}
