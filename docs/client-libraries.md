# Client Libraries

Below are a list of clients provided for M3O

## Clients

- [web](#web) - install the [m3o-web](https://github.com/m3o/m3o-web) dashboard
- [cli](#cli) - install script for the [m3o-cli](https://github.com/m3o/m3o-cli)
- [js](#js) - install the [m3o-js](https://github.com/m3o/m3o-js) client
- [go](#go) - install the [m3o-go](https://github.com/m3o/m3o-go) client

## Usage

A quick overview of how to use all the clients

### Web

Install the m3o web dashboard

```
git clone https://github.com/m3o/m3o-web
cd m3o-web
npm install
npm run dev
```

### CLI

Install the m3o cli

```sh
## follow the instructions
curl -fssl https://install.m3o.com/cli | /bin/bash
```

To use the helloworld service

```
export M3O_API_TOKEN=xxxx

m3o helloworld call --name=Alice
```

### Javascript

Install the m3o js client

```bash
npm install m3o
```

To use the helloworld service

```js
const m3o = require("m3o")(process.env.M3O_API_TOKEN);

// Call returns a personalised "Hello $name" response
async function main() {
  let rsp = await m3o.helloworld.call({
    name: "John",
  });
  console.log(rsp);
}

main();
```

### Go

Install the m3o go client

```bash
go get go.m3o.com
```

To use the helloworld service

```go
package main

import (
    "fmt"
    "os"

    "go.m3o.com"
    "go.m3o.com/helloworld"
)

function main() {
    client := m3o.New(os.Getenv("M3O_API_TOKEN"))

    rsp, err := client.Helloworld.Call(&helloworld.CallRequest{
	      "Name": "Alice",
    })

    fmt.Println(rsp.Message)
}
```
