# M3O Chat

Private and group messaging platform

## Overview

A proof of concept messaging app built on top of M3O.
It was written during the pandemic based on our own experiences. 
It's group based with rooms and private DMs built in.

## Configuration

Set the environment variables by creating `.env.local` file in the repo root with the following:

Configure a remotely authenticated M3O API

```
MICRO_API_ENDPOINT=https://api.m3o.com
MICRO_API_KEY=xxxxx
MICRO_API_NAMESPACE=micro
```

## Run the app

```
npm run dev
```

The application is accessible on http://localhost:3000
