# M3O JS Client

This package contains javascript, node.js and typescript clients.

Usage example:

## Install

```sh
npm install m3o
```

## Usage

```js
const m3o = require("m3o").default(process.env.M3O_API_TOKEN);

// Call returns a personalised "Hello $name" response
async function main() {
  let rsp = await m3o.helloworld.call({
    name: "John",
  });
  console.log(rsp);
}

main();
```
