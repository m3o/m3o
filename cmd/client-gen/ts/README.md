# M3O Client for Javascript

This package contains javascript, node.js and typescript clients.

Usage example:

## Install

```sh
npm install m3o
```

## Usage

```js
const { HelloworldService } = require("m3o/helloworld");

// Call returns a personalised "Hello $name" response
async function callTheHelloworldService() {
  let helloworldService = new HelloworldService(process.env.MICRO_API_TOKEN);
  let rsp = await helloworldService.call({
    name: "John",
  });
  console.log(rsp);
}

callTheHelloworldService();
```
