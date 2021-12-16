package example

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type request struct {
	Name string `json:"name"`
}

type response struct {
	Message string `json:"message"`
}

func Helloworld(w http.ResponseWriter, r *http.Request) {
	message := "Hello world!"

	ct := r.Header.Get("Content-Type")

	if ct == "application/json" {
		b, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(500)
			return
		}

		var req request

		if err := json.Unmarshal(b, &req); err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
			return
		}

		if len(req.Name) > 0 {
			message = "Hello " + req.Name + "!"
		}

		if err := json.NewEncoder(w).Encode(response{Message: message}); err != nil {
			w.WriteHeader(500)
			return
		}

		return
	}

	r.ParseForm()
	name := r.Form.Get("name")

	if len(name) > 0 {
		message = "Hello " + name + "!"
	}

	w.Write([]byte(message))
}
