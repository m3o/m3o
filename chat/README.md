# M3O Chat

Private and group messaging platform

## Overview

A proof of concept messaging app built on top of Micro.
It was written during the pandemic based on our own experiences. 
It's group based with rooms and private DMs built in.

## Install

### Micro Server

Download the [latest release](https://github.com/micro/micro/releases/latest) of Micro

```
micro server
```

Login with default username/password: admin/micro

```
micro login
```

### Setup API

Start the api

```bash
## generate an auth rule to open the api
micro auth create rule --resource=service:chat:* --access=granted --priority=1 chat

## run the service
micro run github.com/micro/chat/api
```

### Optional Configuration

Set the environment variables by creating `.env.local` file in the repo root with the following:




Optionally configure a remotely authenticated Micro API

```
MICRO_API_ENDPOINT=xxxxxxx
MICRO_API_KEY=xxxxxx$(micro user token)
MICRO_API_NAMESPACE=xxxxxx
```

### Start the app

```
npm run dev
```

The application is accessible on http://localhost:3000
