<p align="center">
	<a href="https://m3o.com" style="color: #333333;">
		<img src="images/m3o.png" />
	</a>
</p>
<p align="center">M3O is the open source AWS alternative.<br>We are building a new cloud platform for the Next generation of developers.</p>

---

## Overview

AWS was a first generation public cloud provider started in 2006. Its infrastructure services and pay as go pricing model made it an incredibly 
compelling choice for a previous generation of developers. But what about the future? 

M3O is an attempt to build a new public cloud platform with higher level building blocks for the Next generation of developers. 
M3O is powered by the open source distributed cloud operating system [Micro](https://github.com/micro/micro) and programmable real world [Micro Services](https://github.com/micro/services).

## Features

M3O is host to 40+ [services](#services) and counting. Below are the platform features:

- **🔥 Dev UX** - The developer experience is first priority. A slick new UX and code generated clients for the next generation of developers.
- **☝️ One Token** - Use one Micro API token to fulfill all your API needs. Access multiple public APIs with a single token.
- **⚡ Fast Access** - Using a new API is easy - no need to learn yet another API, it's all the same Micro developer experience.
- **🆓 Free to start** - It's a simple pay as you grow model and everything is priced per request. Top up your account and start making calls.
- **🚫 Anti AWS Billing** - Don't get lost in a sea of infinite cloud billing. We show you exactly what you use and don't hide any of the costs.
- **✔️ Open Source Software** - Built on an open source foundation and services which anyone can contribute to with a simple PR.

## Rationale

AWS is a fairly complex beast which makes it hard for new developers to get started. In the past we needed VMs and file storage, but today with the Jamstack 
and other modern development tools, the building blocks we're looking for are changing. They're mostly now third party APIs. M3O is looking to 
aggregate all those third party public APIs into a single uniform offering with a slick new dev UX for the Next generation.

## Services

So far there are over 40+ services. Here are some of the highlights:

### Backend

- [**Cache**](https://m3o.com/cache) - Quick access key-value storage
- [**DB**](https://m3o.com/db) - Simple database service
- [**Events**](https://m3o.com/event) - Publish and subscribe to messages
- [**Functions**](https://m3o.com/function) - Serverless compute as a service
- [**User**](https://m3o.com/user) - User management and authentication
- [**File**](https://m3o.com/file) - Store, list, and retrieve text files

### Logistics

- [**Address**](https://m3o.com/address) - Address lookup by postcode
- [**Geocoding**](https://m3o.com/geocoding) - Geocode an address to gps location and the reverse.
- [**Location**](https://m3o.com/location) - Real time GPS location tracking and search
- [**Routing**](https://m3o.com/routing) - Etas, routes and turn by turn directions
- [**IP to Geo**](https://m3o.com/ip) - IP to geolocation lookup

### Web

- [**Email**](https://m3o.com/email) - Send emails in a flash
- [**Image**](https://m3o.com/image) - Quickly upload, resize, and convert images
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
- See the [m3o/cli](cli) for command line usage.

## Learn More

- Follow us on [Twitter](https://twitter.com/m3oservices)
- Join the [Slack](https://slack.m3o.com) community
- Join the [Discord](https://discord.gg/TBR9bRjd6Z) server
- Email [Support](mailto:support@m3o.com) for help

## How it Works

Read below to learn more about how it all works

### Infrastructure

M3O is built on existing public cloud infrastructure using managed kubernetes along with our own [infrastructure automation](https://github.com/m3o/platform) 
and abstraction layer for existing third party public APIs. We host the open source [Micro](https://github.com/micro/micro) project as our base OS and 
use it to power all the [Micro Services](https://github.com/micro/services), which provide simpler building blocks for existing cloud primitives.

### Control Plane

We host our own custom dev UX ([m3o/cloud](https://github.com/m3o/cloud)) on top of the infrastructure stack and a [backend](https://github.com/m3o/backend) 
which acts as the management control plane. This productizes the entire offering and allows for publishing of services with configurable pricing.

### Services

Developers build and contribute to services in [github.com/micro/services](https://github.com/micro/services), a vendor neutral home. We then automate the 
building and publishing of those services and generate client libraries for them all. This creates a shared and fully managed platform for everyone to leverage.

## Development

This project is a combination of open source projects and a platform managed by the Micro team. Our goal is to enable any developer to 
contribute to the open source while benefiting from the platform as a shared resource.

### Open Source

The core OS and services are all open sourced in a vendor neutral org:

- [micro/micro](https://github.com/micro/micro) - an open source operating system for the cloud
- [micro/services](https://github.com/micro/services) - open source micro services offered by m3o.com

### M3O Dev UX

We provide the following dev UX for the consumption of Micro services:

- [m3o/cloud](https://github.com/m3o/cloud) - Web UI for a self hostable experience (being replaced by Next.js)
- [m3o/m3o-js](https://github.com/m3o/m3o-js) - JS client library with statically typed interfaces and examples
- [m3o/m3o-go](https://github.com/m3o/m3o-go) - Go client library with code generated functions and examples
- [m3o/platform](https://github.com/m3o/platform) - the infrastructure automation for cloud hosted stack
- [m3o/backend](https://github.com/m3o/backend) - the services which power the m3o.com product backend

### Cloud Hosting

The cloud hosting providers of Micro services:

- [m3o.com](https://m3o.com) - a fully managed offering of micro services

## Publish APIs

If you'd like to publish your own APIs on the M3O platform [fill in this form](https://forms.gle/9SQV6DdLNDzSRQ477) and we'll get back to you.

## Contributing

- **Build examples** - Create things built on top of M3O which we'll feature on the website soon
- **Write services** - Contribute services to [micro/services](https://github.com/micro/services) which will be hosted on M3O
- **Write docs** - Help us write great docs to help everyone quickly get started 
- **Show support** - Join our community on slack or discord, talk about us at work or with friends
