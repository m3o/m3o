import type { ReactNode } from 'react'
import { useState } from 'react'
import { AccordionItem } from '@/components/ui'

type FAQItem = {
  title: string
  content: ReactNode
}

const FAQs: FAQItem[] = [
  {
    title: 'How do I use a M3O API?',
    content: (
      <>
        <p className="mb-6">
          M3O APIs can be accessed via the url
          https://api.m3o.com/v1/*.
        </p>
        <p className="mb-6">
          All requests require
          an API token. You can specify the token in one of three
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
          APIs provide a JSON based request/response and require
          a 'Content-Type: application/json' header for each request.
        </p>
      </>
    ),
  },
  {
    title: 'How do I generate an API token?',
    content: (
      <p>
        To create a new access token, visit API Tokens page. You can specify
        which APIs the token can call or leave scopes blank to create a token
        that has access to all the APIs.
      </p>
    ),
  },
  {
    title: 'Can I use M3O from the terminal?',
    content: (
      <p>
        M3O includes a command line interface from which you can explore and
        query services. Go to{' '}
        <a href="https://github.com/m3o/m3o-cli/releases/latest">
          https://github.com/m3o/m3o-cli/releases/latest
        </a>{' '}
        to download the latest release.
      </p>
    ),
  },
  {
    title: 'How do request quotas work?',
    content: (
      <>
        <p className="mb-6">
          Request quotas provides usage limits for each api. These are hard limits 
	  applied on a per request basis when calling M3O APIs. If a quota is exceeded 
          further requests will be blocked e.g adding DB records, uploading images, etc.
        </p>
      </>
    ),
  },
  {
    title: 'How does billing and usage work?',
    content: (
      <>
        <p className="mb-6">
          Each account has an API request quota and credit based balance.
          Any request made to an API will be debited from the quota in real time. 
          When the quota is exhausted the credit balance is debited instead.
          If your balance is zero, requests to APIs will be blocked.
        </p>
        <p className="mb-6">
          API calls beyond the quota are charged a minimum of 0.000001 credit per request 
          ($1 per credit).
          Premium APIs are exclusively paid from the balance on account.
        </p>
        <p>
          To check your balance and top-up your account head to the Billing page.
        </p>
      </>
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
      <h2 className="font-bold text-3xl text-center">FAQs</h2>
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
