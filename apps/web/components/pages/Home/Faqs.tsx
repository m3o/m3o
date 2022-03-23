import type { ReactNode } from 'react'
import { useState } from 'react'
import { AccordionItem } from '@/components/ui'

type FAQItem = {
  title: string
  content: ReactNode
}

const FAQs: FAQItem[] = [
  {
    title: 'How do I generate an API token?',
    content: (
      <p>
        To create a new access token, visit API settings page. You can specify
        which APIs the token can call or leave scopes blank to create a token
        that has access to all the APIs.
      </p>
    ),
  },
  {
    title: 'How do I use an API?',
    content: (
      <>
        <p className="mb-6">
          M3O APIs can be accessed via the url
          "https://api.m3o.com/v1/[service]/[endpoint] ". All API calls require
          an API token to be provided. You can specify the token in one of three
          ways:
        </p>
        <ul className="list-disc mb-6">
          <li className="mb-4">
            via the "Authorization" header. Prepend your API token with the
            string "Bearer" i.e. the header will look like "Authorization:
            Bearer &lt;YOUR API TOKEN&gt;"
          </li>
          <li>
            via HTTP basic authentication. Use the string "user" as the username
            and use your API token as the password - via the
            "Sec-Websocket-Protocol" header for websocket calls. Pass your API
            token as the protocol name
          </li>
        </ul>
        <p className="mb-6">
          Our APIs provide a JSON based request/response format and also require
          a 'Content-Type: application/json' header for each request.
        </p>
        <p>
          After familiarising yourself with an API by reading the API reference
          (e.g{' '}
          <a href="https://m3o.com/db/api#Read">https://m3o.com/db/api#Read</a>)
          you probably want to start calling the API. M3O APIs can be called via
          HTTP in any language or using our node.js and Golang specific clients.
        </p>
      </>
    ),
  },
  {
    title: 'How do I download the M3O CLI?',
    content: (
      <p>
        M3O includes a command line interface from which you can explore and
        query services. Go to{' '}
        <a href="https://github.com/m3o/m3o-cli/releases/latest">
          https://github.com/m3o/m3o-cli/releases/latest
        </a>{' '}
        to download the latest release binary.
      </p>
    ),
  },
  {
    title: 'How does billing and usage work?',
    content: (
      <>
        <p className="mb-6">
          The majority of our APIs are free, with a 100,000 request per month
          quota on the free tier. Third party APIs or calls that perform
          specific functions such as SMS or email are charged for and billed per
          request. Each account has a credit based balance. Any request made to
          a paid API will be debited from the balance in real time. When your
          balance is zero requests to paid APIs will return a blocked status.
        </p>
        <p>
          Additional API calls beyond the free quota are charged at 0.000001
          credit per request (aka £1 per 1 million requests). To check your
          balance and top-up your account head to the Billing page.
        </p>
      </>
    ),
  },
  {
    title: 'What is included in the free tier?',
    content: (
      <p>
        Our free tier is rate limited to 10 requests per second. This can be
        unlocked by upgrading to the Pro subscription. We also invoke fair usage
        limits on compute and storage. During the beta period no hard limits are
        enforced, we will reach out if there are any issues.
      </p>
    ),
  },
  {
    title: 'What is the best way to contact M3O?',
    content: (
      <p>
        Join the community and ask questions on{' '}
        <a href="https://discord.gg/TBR9bRjd6Z">Discord</a>. If you&apos;re
        subscribed to the Pro tier email{' '}
        <a href="mailto:support@m3o.com">support@m3o.com</a> for help. Otherwise
        you can provide feedback at{' '}
        <a href="mailto:contact@m3o.com">contact@m3o.com</a>.
      </p>
    ),
  },
]

export function Faqs() {
  const [currentOpen, setCurrentOpen] = useState('')

  function handleRowClick(title: string): void {
    setCurrentOpen(prev => (prev === title ? '' : title))
  }

  return (
    <div>
      <h2 className="font-bold text-3xl text-center gradient-text">FAQs</h2>
      {FAQs.map(item => (
        <AccordionItem
          title={item.title}
          key={item.title}
          onClick={() => handleRowClick(item.title)}
          isOpen={currentOpen === item.title}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}
