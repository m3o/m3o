<p align="center">
	<a href="https://m3o.com" style="color: #333333;">
		<img id="banner" src="docs/assets/images/xaas.jpeg" />
	</a>
</p>
<p align="center">
	<a href="https://discord.gg/TBR9bRjd6Z"><img src="https://img.shields.io/badge/join-discord-purple"></a>
	<a href="https://m3o.com"><img src="https://img.shields.io/badge/signup-free-green"></a>
	<a href="https://twitter.com/m3oservices"><img src="https://img.shields.io/badge/twitter-follow-blue"></a>
	<a href="https://github.com/m3o/m3o"><img src="https://img.shields.io/badge/github-repo-yellow"></a>

</p>

<p align="center" style="font-weight: bold">
  <a href="https://m3o.com" style="color: #333333;">
    <img id="banner" src="docs/assets/images/m3o.png" style="width: 100px; height: auto;"/>
  </a>
  <br>
  Next generation cloud platform
  <p align="center"><a href="https://m3o.com/register" id="signup">Signup and start for FREE</a></p>
</p>

## Introduction

M3O is a next generation cloud plaform. Explore, discover and consume public APIs as simpler programmable building blocks.

ONE platform, ONE account, ONE framework. 

## Features

Here are the main features:

- **1️⃣ One Platform** - Discover, explore and consume public APIs all in one place. 
- **☝️ One Account** - Manage your API usage with one account and one token.
- **⚡ One Framework** - Learn, develop and integrate using one set of docs and libraries.
- **🆓 Pay As You Grow** - It's free to start and everything is priced per request.
- **🚫 Anti Cloud Billing** - Predictable pricing with no hidden costs.

## Services

So far there are over 50+ APIs. Here are some of the highlights:

### ☁️ Cloud

- [**Apps**](https://m3o.com/app) - Serverless app deployment
- [**Database**](https://m3o.com/db) - Serverless postgres database
- [**Functions**](https://m3o.com/function) - Serverless lambda functions
- [**Events**](https://m3o.com/event) - Publish and subscribe to messages
- [**Users**](https://m3o.com/user) - User management and authentication
- [**Space**](https://m3o.com/space) - Infinite cloud storage
- [**Search**](https://m3o.com/search) - Indexing and full text search

### 🗺️ Logistics

- [**Address**](https://m3o.com/address) - Address lookup by postcode
- [**Geocoding**](https://m3o.com/geocoding) - Geocode an address to gps location and the reverse.
- [**Location**](https://m3o.com/location) - Real time GPS location tracking and search
- [**Places**](https://m3o.com/place) - Search for geographic points of interest
- [**Routes**](https://m3o.com/routing) - Etas, routes and turn by turn directions
- [**IP2Geo**](https://m3o.com/ip) - IP to geolocation lookup

### ⚙️ Miscellaneous

- [**Email**](https://m3o.com/email) - Send emails in a flash
- [**Image**](https://m3o.com/image) - Quickly upload, resize, and convert images
- [**OTP**](https://m3o.com/otp) - One time password generation
- [**QR Codes**](https://m3o.com/qr) - QR code generator
- [**SMS**](https://m3o.com/sms) - Send an SMS message
- [**Weather**](https://m3o.com/weather) - Real time weather forecast

See the full list at [m3o.com/explore](https://m3o.com/explore).

## Getting Started

- Head to [m3o.com](https://m3o.com) and signup for a free account.
- Browse the APIs on the [Explore](https://m3o.com/explore) page.
- Call any API using your token in the `Authorization: Bearer [Token]` header
- All APIs are available through one endpoint: `https://api.m3o.com/v1/*`.
- Use [m3o-cli](https://github.com/m3o/m3o-cli), [m3o-js](https://github.com/m3o/m3o-js) and [m3o-go](https://github.com/m3o/m3o-go) clients for development

## Quick Start

Grab your API token from the dashboard and try out helloworld and export it as 

```
M3O_API_TOKEN=xxxxxxx
```

### Curl

```bash
curl \
  -H "Authorization: Bearer $M3O_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}' \
  https://api.m3o.com/v1/helloworld/call
```

Find all the shell examples in [m3o-sh](https://github.com/m3o/m3o-sh)

### Go

Import packages from [go.m3o.com](https://pkg.go.dev/go.m3o.com)

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

### Javascript

Install the [m3o](https://www.npmjs.com/package/m3o) package

```
npm install m3o
```

Call helloworld like so

```javascript
const { HelloworldService } = require("m3o/helloworld");

const helloworldService = new HelloworldService(process.env.M3O_API_TOKEN);

async function callHelloworld() {
  const rsp = await helloworldService.call({
    name: "Alice",
  });
  console.log(rsp);
}

callHelloworld();
```

Find more JS examples in [m3o-js](https://github.com/m3o/m3o-js)

### CLI

Download the [m3o-cli](https://github.com/m3o/m3o-cli)

```
m3o helloworld call --name=Alice
```

See the [examples](../examples) for more use cases.

## Learn More

- Checkout the [Getting Started](https://m3o.com/getting-started) guide
- Follow us on [Twitter](https://twitter.com/m3oservices) for updates
- Join the [Discord](https://discord.gg/TBR9bRjd6Z) server
- Read the [Blog](https://blog.m3o.com) for content
- See the [Docs](docs) for more info

## Contributing

- **Showcase Apps** - Show off your work and win up to $100 in swag and prizes. See [showcase](showcase) for more info
- **Write Snippets** - Share code [snippets](snippets) built with M3O which we'll feature on the website soon
- **Build Services** - Every API you build is rewarded $10 in credit. See the discussion [thread](https://github.com/m3o/m3o/discussions/92)
- **Create Clients** - Help us create more [client libraries](docs/client-libraries) to work in many different languages
