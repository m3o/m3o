<p align="center">
	<a href="https://m3o.com" style="color: #333333;">
		<img src="images/m3o.png" />
	</a>
</p>
<p align="center">Next Generation Cloud Platform</p>
<p align="center">
	<a href="https://discord.gg/TBR9bRjd6Z"><img src="https://img.shields.io/badge/join-discord-purple"></a>
	<a href="https://m3o.com"><img src="https://img.shields.io/badge/signup-now-green"></a>
</p>

---

## Overview

M3O is a new cloud platform with simpler higher level building blocks. Consume free and paid public APIs all on one platform for a 10x developer experience. 
Signup and start for free at [m3o.com/register](https://m3o.com/register).

## Features

Here are the main features of M3O

- **🔥 10x Dev UX** - Developers are first priority. We provide a slick UX with code generated clients for a 10x developer experience.
- **☝️ One Token** - Use one account on one platform to fulfill all your API needs. Access multiple public APIs with a single API token.
- **⚡ Fast Access** - Using a new API is easy - no need to learn yet another API, it's all the same developer experience.
- **🆓 Free to start** - It's a simple pay as you grow model and everything is priced per request. Top up your account and start making calls.
- **🚫 Anti AWS Billing** - Don't get lost in a sea of infinite cloud billing. We show you exactly what you use and don't hide any of the costs.

## Rationale

Cloud is a fairly complex beast which makes it hard for new developers to get started. In the past we needed VMs and file storage, but today with the Jamstack 
and other modern development tools, the building blocks we're looking for are changing. We're mostly now consuming third party public APIs. M3O wants to aggregate all those APIs onto one platform as simpler programmable building blocks for a 10x developer experience.

## Services

So far there are over 50+ services. Here are some of the highlights:

### Coming soon

- [**Search**](https://m3o.com/search) - Indexing and full text search

### Backend

- [**Apps**](https://m3o.com/app) - Global app deployment
- [**Cache**](https://m3o.com/cache) - Quick access key-value storage
- [**DB**](https://m3o.com/db) - Simple database service
- [**Events**](https://m3o.com/event) - Publish and subscribe to messages
- [**Functions**](https://m3o.com/function) - Serverless compute as a service
- [**User**](https://m3o.com/user) - User management and authentication
- [**Space**](https://m3o.com/space) - Infinite cloud storage

### Logistics

- [**Address**](https://m3o.com/address) - Address lookup by postcode
- [**Geocoding**](https://m3o.com/geocoding) - Geocode an address to gps location and the reverse.
- [**Location**](https://m3o.com/location) - Real time GPS location tracking and search
- [**Routing**](https://m3o.com/routing) - Etas, routes and turn by turn directions
- [**IP to Geo**](https://m3o.com/ip) - IP to geolocation lookup

### Web

- [**Email**](https://m3o.com/email) - Send emails in a flash
- [**Image**](https://m3o.com/image) - Quickly upload, resize, and convert images
- [**NFTs**](https://m3o.com/nft) - Explore NFT assets and collections
- [**OTP**](https://m3o.com/otp) - One time password generation
- [**QR Codes**](https://m3o.com/qr) - QR code generator
- [**SMS**](https://m3o.com/sms) - Send an SMS message
- [**Weather**](https://m3o.com/weather) - Real time weather forecast

See the full list at [m3o.com/explore](https://m3o.com/explore).

## Getting Started

- Head to [m3o.com](https://m3o.com) and signup for a free account.
- Generate an API key on the [Settings page](https://m3o.com/account/keys).
- Browse the APIs on the [Explore page](https://m3o.com/explore).
- Call any API using your token in the `Authorization: Bearer [Token]` header and `https://api.m3o.com/v1/[service]/[endpoint]` url.
- See the [m3o-cli](https://github.com/m3o/m3o-cli) for command line usage.

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

## Learn More

- Follow us on [Twitter](https://twitter.com/m3oservices) for updates
- Join the [Discord](https://discord.gg/TBR9bRjd6Z) server
- Read the [Blog](https://blog.m3o.com)

## How it Works

Read below to learn more about how it all works

### Infrastructure

M3O is built on existing public cloud infrastructure using managed kubernetes along with our own [infrastructure automation](https://github.com/m3o/platform). 
We host the open source project [Micro](https://github.com/micro/micro) as our base cloud OS and use it to power all the [Micro Services](services).

### Control Plane

We host our own [cloud](https://github.com/m3o/cloud-next) Next.js UX on top of the infrastructure stack and a [backend](https://github.com/m3o/backend) 
which acts as the management control plane. This productizes the entire offering and allows for publishing of services with configurable pricing.

### Micro Services

Developers build and contribute to [Micro Services](services), which act as an abstraction layer for existing third party 
public APIs. We then automate the building and publishing of those services and generate client libraries for them all. 

## Development

This project is a combination of open source projects and a platform managed by the M3O team. Our goal is to enable any developer to 
contribute to the open source while benefiting from the platform as a shared resource.

### Source

The core services, automation and the backend are all open source:

- [services](services) - offered on the M3O platform
- [platform](https://github.com/m3o/platform) - infrastructure automation
- [backend](https://github.com/m3o/backend) - powering the M3O platform

### Dev UX

We provide the following dev UX for the consumption of Micro services:

- [m3o-web](https://github.com/m3o/m3o-web) - Next.js based Web dashboard which can be self hosted
- [m3o-js](https://github.com/m3o/m3o-js) - JS client library with statically typed interfaces and examples
- [m3o-go](https://github.com/m3o/m3o-go) - Go client library with code generated functions and examples
- [m3o-cli](https://github.com/m3o/m3o-cli) - Command line interface for terminal access to services

## Publish APIs

If you'd like to publish your own APIs on the M3O platform [fill in this form](https://forms.gle/9SQV6DdLNDzSRQ477) and we'll get back to you.

## Contributing

- **Write examples** - Create [examples](examples) built with M3O which we'll feature on the website soon
- **Show support** - Join the community on [discord](https://discord.gg/TBR9bRjd6Z) or follow us on [twitter](https://twitter.com/m3oservices) for updates
