package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	token := os.Getenv("M3O_API_TOKEN")
	if len(token) == 0 {
		fmt.Println("Missing M3O_API_TOKEN")
		return
	}

	query := map[string]interface{}{
		"name": "John",
	}
	b, _ := json.Marshal(query)

	req, _ := http.NewRequest("POST", "https://api.m3o.com/v1/helloworld/call", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	rsp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer rsp.Body.Close()
	b, _ = ioutil.ReadAll(rsp.Body)

	fmt.Println(string(b))
}
