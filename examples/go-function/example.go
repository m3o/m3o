package example

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type response struct {
	Message string `json:"message"`
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	d, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(500)
		return
	}
	if err := json.NewEncoder(w).Encode(response{Message: string(d)}); err != nil {
		w.WriteHeader(500)
		return
	}
}
