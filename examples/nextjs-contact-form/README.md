# M3O Next.js Contact Form Example

In this example we are making use of the [M3O Email Service](https://m3o.com/email). This makes it quick and simple to send emails straight from your API. In this example we have setup a basic contact form which sends you an email with the form fields provided.

## Creating and consuming your API key

To make use of the Email service, and any of the M3O services, you'll first need to create an API Key.

If you have not already, firstly [register / signup](https://m3o.com/register) and create your key.

Once you have copied your API key next you'll need to create your `.env.local` file. Once created, you'll then need to add this environment variable:

`M3O_KEY=xxxxxx`

This will initialise the Email service in the `pages/api/contact/index.ts` file.

##### WARNING: BE SURE NEVER TO LEAK THIS KEY

## Setting up the project

First, install the required packages

```bash

npm i

```

Then run the development server:

```bash

npm run dev

```

Once you have setup the the project you will be good to go. Make sure that you adjust the details in the `pages/api/contact/index.ts` file.

Happy coding!
