package main

import (
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"m3o.dev/app/handler"
)

func main() {
	// new handler
	hdr := handler.New()

	// register handler
	http.Handle("/", handlers.CombinedLoggingHandler(os.Stdout, hdr))

	// run on port 8080
	http.ListenAndServe(":8080", nil)
}
