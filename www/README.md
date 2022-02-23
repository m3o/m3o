# M3O Web

The M3O Web Dashboard

## Overview

M3O is a next generation cloud platform. We offer public APIs as simpler programmable building blocks for a 10x developer experience. The M3O Web 
Dashboard is the way we present those APIs for consumption to the world. It's an open source project which is hosted on [m3o.com](https://m3o.com) and 
can additionally be self hosted by anyone else.

## Built With

- [Next.js](https://nextjs.org/)
- [Tailwind](https://tailwindcss.com/)

## Disclaimer

M3O-Web is constantly undergoing changes and updates, `git pull` as much as possible to ensure you have the latest code. If you see anything that causes confusion or raises questions, please [email us](mailto:contact@m3o.com) or join our [Discord](https://discord.com/invite/TBR9bRjd6Z) and we'll help with any queries.

## Development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment Variables

The following env vars are required for production use.

```
NEXT_PUBLIC_API_URL=https://api.m3o.com
NEXT_PUBLIC_STRIPE_KEY=pk_live_CPlU8hrgrZBGZIg1NZjdpx6p
NEXT_PUBLIC_TEST_STRIPE_KEY=pk_test_wuI8wlKwKBUZ9iHnYlQPa8BH
NEXT_PUBLIC_NAMESPACE=micro
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
