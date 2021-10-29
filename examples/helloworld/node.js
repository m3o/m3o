const m3o = require('@m3o/m3o-node');

new m3o.Client({ token: process.env.M3O_API_TOKEN })
  .call('helloworld', 'call', {"name": "John"})
  .then((response) => {
    console.log(response);
  });
