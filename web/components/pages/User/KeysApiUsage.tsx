import type { FC } from 'react'
import { Card, Alert } from '@/components/ui'

export const KeysApiUsage: FC = () => {
  return (
    <div className="tbgc p-6 md:p-10 rounded-lg">
      <h1 className="font-bold text-xl text-black md:text-2xl dark:text-white">
        API Usage
      </h1>
      <p className="mt-4 text-sm md:text-base ttc">
        To use an API key simply pass as the &quot;Authorization&quot; header in
        the HTTP request to the Micro API. Note, we use the &quot;Bearer&quot;
        authentication scheme so you should prefix the API key with{' '}
        <span className="font-mono">Bearer</span>
      </p>
      <div className="font-mono text-sm mt-4 p-4 bg-zinc-700 rounded-md text-white whitespace-nowrap overflow-x-scroll">
        curl -H &lsquo;Authorization: Bearer $KEY&rsquo;
        https://api.m3o.com/v1/&#123;service&#125;/&#123;endpoint&#125;
      </div>
      <Alert className="mt-4" type="warning">
        Warning: API keys should be kept secret; you should avoid embedding the
        API key in your frontend code, otherwise it can be reused by others
        without your knowledge. An example of how to hide your key behind a
        Netlify (or Vercel) function can be found{' '}
        <a
          href="https://github.com/m3o/examples/tree/main/m3o-netlify-functions-example"
          target="_blank"
          rel="noreferrer"
          className="underline">
          here
        </a>
        .
      </Alert>
    </div>
  )
}
