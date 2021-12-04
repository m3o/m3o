# Micro Services

Micro Services offered on M3O

## Overview

Micro Services provide the fundamental building blocks for any products, apps or services. They can be used in isolation 
or combined to create a powerful distributed system. The services are intended to be consumed by each other using RPC 
and from the external world through a Micro API.

## Cloud

Find cloud hosted services on [m3o.com](https://m3o.com).

## Usage

Run a service from source

```
micro run github.com/m3o/m3o/services/helloworld
```

To call a service from another

```
import "github.com/m3o/m3o/services/helloworld/proto"
```

## Contribute

We welcome contributions of additional services which are then hosted on [m3o.com](https://m3o.com).

- Services must be built using the Micro platform
- Any dependency must be configured using the Micro Config
- All services to be published must include a `publicapi.json` file

