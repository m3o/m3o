<p align="center">
  <a href="https://m3o.com">
    <img src="https://avatars.githubusercontent.com/u/65984637?s=200&v=4" height="96">
    <h3 align="center">M3O</h3>
  </a>
  <p align="center">An open source AWS alternative</p>
</p>

[M3O](https://m3o.com) is an open source public cloud platform. We are building an AWS alternative for the next generation of developers.

## Overview

AWS has become the monstrous behemoth public cloud provider we all love to hate. It's massive complexity and confusing pricing has made it an incredibly 
difficult choice for developers to adopt. But what's the alternative? M3O is an attempt to build a new open source public cloud platform for the next generation 
of developers. Consume existing public APIs all in one place as simpler programmable building blocks. 

M3O is powered by the open source [Micro](https://github.com/micro/micro) platform and programmable real world [Micro Services](https://github.com/micro/services).

## Features

Here's the highlights:

- **🔥 Dev UX** - The developer experience is first priority. A slick new UX for the next generation of developers.
- **☝️ One Token** - Use one Micro API token to fulfill all your API needs. Access multiple public APIs with a single token.
- **⚡ Fast Access** - Using a new API is easy - no need to learn yet another API, it's all the same Micro developer experience.
- **🆓 Free to start** - It's a simple pay as you go model and everything is priced per request. Top up your account and start making calls.
- **🚫 Anti AWS Billing** - Don't get lost in a sea of infinite cloud billing. We show you exactly what you use and don't hide any of the costs.
- **✔️ Open Source Software** - Built on an open source foundation and services which anyone can contribute to or run independently.

## Services

Currently with over 35+ services. Here are some of the services offered:

- [Address](https://m3o.com/address) - Address lookup by postcode
- [Cache](https://m3o.com/cache) - Quick access key-value storage
- [Currency](https://m3o.com/currency) - Exchange rates and currency conversion
- [DB](https://m3o.com/db) - Simple database service
- [Email](https://m3o.com/email) - Send emails in a flash
- [File](https://m3o.com/file) - Store, list, and retrieve text files
- [Functions](https://m3o.com/function) - Serverless compute as a service
- [Geocoding](https://m3o.com/geocoding) - Geocode an address to gps location and the reverse.
- [Id](https://m3o.com/id) - Generate unique IDs (uuid, snowflake, etc)
- [Image](https://m3o.com/image) - Quickly upload, resize, and convert images
- [IP](https://m3o.com/ip) - IP to geolocation lookup
- [Location](https://m3o.com/location) - Real time GPS location tracking and search
- [OTP](https://m3o.com/otp) - One time password generation
- [QR Codes](https://m3o.com/qr) - QR code generator
- [Routing](https://m3o.com/routing) - Etas, routes and turn by turn directions
- [SMS](https://m3o.com/sms) - Send an SMS message
- [Stream](https://m3o.com/stream) - Publish and subscribe to messages
- [User](https://m3o.com/user) - User management and authentication
- [Weather](https://m3o.com/weather) - Real time weather forecast

See the full list at [m3o.com/explore](https://m3o.com/explore) or the source at [github.com/micro/services](https://github.com/micro/services).

## Getting Started

- Head to [m3o.com](https://m3o.com) and signup for a free account. 
- Generate an API key on the [Settings page](https://m3o.com/settings/keys).
- Browse the APIs on the [Explore page](https://m3o.com/explore).
- Call any API using your token in the `Authorization: Bearer [Token]` header and `https://api.m3o.com/v1/[service]/[endpoint]` url.

## Learn More

- Checkout the [Examples](examples) to see what you can build
- Read the [Announcement](https://blog.m3o.com/2021/06/24/micro-apis-for-everyday-use.html) blog post
- Join the [Slack](https://slack.m3o.com) community
- Join the [Discord](https://discord.gg/TBR9bRjd6Z) channel
- Email [Support](mailto:support@m3o.com) for help

## How it Works

M3O is built on existing public cloud infrastructure using managed kubernetes along with our own [infrastructure automation](https://github.com/m3o/platform) 
and abstraction layer for existing public APIs. We host the open source [Micro](https://github.com/micro/micro) project as our base Cloud OS and use it to 
power all the [Micro Services](https://github.com/micro/services), which provide simpler building blocks for existing cloud primitives.

We then host our own custom dev UX on top and a [backend](https://github.com/m3o/backend) as the management control plane.

Developers build and contribute to services in [github.com/micro/services](https://github.com/micro/services), an Apache 2.0 licensed vendor neutral home. 
We then automate the building and publishing of those services and client libraries. This creates a shared and fully managed platform for everyone to leverage. 

We primarily use existing open source software, fully managed services and SaaS APIs as the backing infrastructure then layer a standard interface on top. With 
all the services on one platform, accessible with one API token, we drastically improve the Dev UX.

## Development

This project is VC funded with a combination of open source development and platform management provided by the Micro team.

### Cloud Hosting

The cloud hosted providers of Micro services:

- [m3o.com](https://m3o.com) - a fully managed offering of micro services

### Open Source

The core cloud OS and services exists in a vendor neutral org and are Apache 2.0 licensed

- [micro/micro](https://github.com/micro/micro) - an open source operating system for the cloud
- [micro/services](https://github.com/micro/services) - open source micro services powering m3o.com

### M3O Dev

The hosting of Micro services on [m3o.com](https://m3o.com) is powered by the following:

- [m3o/cloud](https://github.com/m3o/cloud) - locally hostable angular based dev UX for the website
- [m3o/platform](https://github.com/m3o/platform) - the infrastructure automation for cloud hosted stack
- [m3o/backend](https://github.com/m3o/backend) - the services which power the m3o.com product backend


## Publish APIs

If you'd like to publish your own APIs on the M3O platform [fill in this form](https://forms.gle/9SQV6DdLNDzSRQ477) and we'll get back to you.
