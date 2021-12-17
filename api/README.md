# M3O API

The M3O API consists of a set of many public apis all consumed through a single gateway.

## Overview

M3O APIs are a standard set of http/json APIs which act as programmable building blocks 
for rapid development of any product or services. Pick up and use one or more APIs as 
easily as importing a library and making a function call from a library. M3O APIs are 
hosted versions of [github.com/micro/services](https://github.com/micro/services).

## Examples

Here's a simple helloworld

### Curl

```
curl -H "Authorization: Bearer $M3O_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "John"}' \
     https://api.m3o.com/v1/helloworld/call
```

Find all the shell examples in [m3o-sh](https://github.com/m3o/m3o-sh)

### Go

Import packages from `go.m3o.com`

```go
import "go.m3o.com/helloworld"
```

Create a new client with your API token and call it

```go
helloworldService := helloworld.NewHelloworldService(os.Getenv("M3O_API_TOKEN"))

rsp, err := helloworldService.Call(&helloworld.CallRequest{
	"Name": "Alice",
})

fmt.Println(rsp.Message)
```

Find all the Go examples in [m3o-go](https://github.com/m3o/m3o-go)

### JS

Install the m3o package

```
npm install m3o
```

Call helloworld like so

```javascript
const { HelloworldService } = require("m3o/helloworld");

const helloworldService = new HelloworldService(process.env.M3O_API_TOKEN);

// Call returns a personalised "Hello $name" response
async function callTheHelloworldService() {
  const rsp = await helloworldService.call({
    name: "John",
  });
  console.log(rsp);
}

callTheHelloworldService();
```

Find more JS examples in [m3o-js](https://github.com/m3o/m3o-js)

See the [examples](../examples) for more use cases.

## API Endpoint

The canonical API endpoint is

```
https://api.m3o.com/v1/
```

All service endpoints are append like so. 

```
# Assuming helloworld with Call endpoint

https://api.m3o.com/v1/helloworld/Call
```

## Authorization

All API calls require a valid API token. New tokens can be generated on the [API settings](https://m3o.com/settings/keys) page.

An API token should be passed in the `Authorization: Bearer` header

```
Authorization: Bearer $MICRO_API_TOKEN
```

## Data Format

All request/responses are in JSON format and require a `Content-Type: application/json` header to be passed on each request.

## OpenAPI Specs

Find the OpenAPI specs in the [spec](spec) directory

## Public APIs

A list of public APIs can be found on [m3o.com/explore](https://m3o.com/explore)
