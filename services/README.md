# M3O Services

M3O services provide the fundamental building blocks for any products, apps or services. They can be used in isolation 
or combined to create powerful distributed systems. The services are intended to be consumed by each other using RPC 
and externally through the M3O API.

## Interfaces

Every service starts with a protobuf interface definition, which is a standard used by Google and everyone else now that gRPC is so dominant. The idea is to define the API in protobuf, code generate and implement the handlers for it. The services can be called by other services on the platform using those code generated clients or an API Gateway, which M3O provides. External calls via the API use the same format but with HTTP/JSON endpoints.

## Services

Services available thus far:

- address - Address lookup by postcode
- analytics - Track and retrieve events
- answer - Instant answers to any question
- app - Serverless app deployment
- avatar - Generate an avatar
- bitcoin - Bitcoin price and transaction info
- cache - Fast access key-value storage
- carbon - Purchase carbon offsets
- chat - Instant messaging service
- comments - Add comments to any App
- contact - Store your contacts
- cron - Schedule cron jobs
- crypto - Cryptocurrency prices, quotes, and news
- currency - Exchange rates and currency conversion
- db - Serverless postgres database
- dns - DNS over HTTPS (DoH)
- email - Send emails in a flash
- emoji - All the emojis you need 🎉
- ethereum - Ethereum API explorer
- evchargers - Find electric vehicle (EV) chargers wherever you go 
- event - Event stream processing
- file - Store, list, and retrieve text files
- forex - Foreign exchange (FX) rates
- function - Serverless lambda functions
- geocoding - Address geocoding and reverse lookup
- gifs - Quick and simple GIF search
- google - Google search service
- helloworld - Just saying hello world
- holidays - Find the holidays observed in a particular country
- id - Generate unique IDs (uuid, snowflake, etc)
- image - Upload, resize, and convert images
- ip - IP to geolocation lookup
- joke - Funny Jokes
- lists - Make a list
- location - Real time GPS location tracking and search
- memegen - Generate funny memes
- minecraft - Minecraft server ping
- movie - Search for movies
- mq - PubSub messaging
- news - Get the latest news
- nft - Explore NFT Assets
- notes - Store and retrieve notes
- otp - One time password generation
- password - Generate strong passwords
- ping - Ping any IP
- place - Search for places
- postcode - Fast UK postcode lookup
- prayer - Islamic prayer times
- price - Global commodities index
- qr - QR code generator
- quran - The Holy Quran
- routing - Etas, routes and turn by turn directions
- rss - RSS feed crawler and reader
- search - Indexing and full text search
- sentiment - Real time sentiment analysis
- sms - Send SMS messages
- space - Infinite cloud storage
- spam - Check if an email is spam
- stock - Live stock quotes and prices
- stream - Ephemeral message streams
- sunnah - Traditions and practices of the Islamic prophet, Muhammad (pbuh)
- thumbnail - Create website thumbnails
- time - Time, date, and timezone info
- translate - Language translation service
- tunnel - Tunnel HTTP requests
- twitter - Realtime twitter timeline & search
- url - URL shortening, sharing, and tracking
- user - Authenticate and manage users
- vehicle - UK vehicle lookup
- wallet - Virtual Wallet 
- weather - Real time weather forecast
- wordle - Multiplayer wordle
- youtube - Search for YouTube videos

## Usage

M3O Services depend on [Micro](https://github.com/micro/micro)

### Run Micro

Install and run the server first

```
micro server
```

### Run a Service

Run a service from source

```
micro run github.com/m3o/m3o/services/helloworld
```

### Call a Service

To call a service from another

```go
import "m3o.dev/services/helloworld/proto"
```

Call it through the API

```
curl "http://localhost:8080/helloworld/Call?name=Alice"
```

From the command line

```
micro helloworld call --name=Alice
```

Browse to

```
http://localhost:8082/helloworld/Call
```

## Hosting

M3O Services are hosted on [M3O](https://m3o.com) as serverless APIs

M3O converts protobuf to openapi specs and generates clients for the hosted services.

## Contribute

We welcome contributions of additional services:

- Services must be built using the M3O platform
- Any dependency must be configured using the M3O Config
- All services must include a README.md and be well commented

## Config

Config for each service should be stored under the service key by name

E.g db postgres host address `db.address`
