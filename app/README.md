# M3O App

The home for apps, functions and more 

## Overview

The M3O app is a single entrypoint for apps, functions and more hosted on the M3O platform.
It acts as a launcher for other apps and functions that are UI based.

Supported features:

- [apps](#apps)
- [functions](#functions)
- [url generator](#url-generator)
- [user verification](#user-verification)

## Apps

Apps are given a unique id and subdomain using m3o.app e.g [helloworld.m3o.app](https://helloworld.m3o.app) resolves to the app id helloworld.

The `/v1/app/Resolve` endpoint is called with the ID specified to resolve the backend URL for the app

## Functions

Functions are given a unique id and subdomain much like apps using m3o.sh e.g [helloworld.m3o.sh](https://helloworld.m3o.sh/) resolves to the 
function helloworld. 

The `/v1/function/Proxy` endpoint is called with the ID specified to resolve the backend URL for the function

## URL Generator

The [URL](https://github.com/micro/services/tree/master/url) service provides link generation and sharing. 

- Assumes url is of format `/url/AArfeZE`
- Will call `https://api.m3o.com/url/resolve?id=AArfeZE`
- URL service should return `destinationURL=https://foobar.com/example`
- The ingress URL proxy handler will issue a 302 redirect

## User Verification

User email verification is performed via the `/v1/user/VerifyEmail` endpoint. The ingress serves [user.m3o.com](https://user.m3o.com) for this purpose.

This is also available via the `/user/[id]` endpoint

## Usage

Specify `M3O_API_TOKEN` to the binary and run the ingress

### Micro Services

Set the config values 

```
micro config set micro.app.domain m3o.app
micro config set micro.app.domain m3o.sh
micro config set micro.url.host_prefix https://m3o.one/u/
micro config set micro.user.verify_email_url https://user.m3o.com
```

Deploy the url, function, app, user services

```
micro run github.com/micro/services/app
micro run github.com/micro/services/function
micro run github.com/micro/services/url
micro run github.com/micro/services/user
```
