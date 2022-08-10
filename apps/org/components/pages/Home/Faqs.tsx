import type { ReactNode } from 'react'
import { useState } from 'react'
import { AccordionItem } from '@/components/ui'

type FAQItem = {
  title: string
  content: ReactNode
}

const FAQs: FAQItem[] = [
  {
    title: 'Where do I get an access token?',
    content: (
      <p>
        To create a new access token, visit the tokens page. You can specify
        which services the token can call or leave scopes blank to create a token
        that has access to everything.
      </p>
    ),
  },
  {
    title: 'How do I use the services?',
    content: (
      <>
        <p className="mb-6">
          M3O services can be accessed via the url
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
    title: 'Where is the source code?',
    content: (
      <p>
        M3O source code is open source and available on{' '}
        <a href="https://github.com/m3o">
          GitHub
        </a>.
      </p>
    ),
  },
  {
    title: 'How does service billing work?',
    content: (
      <>
        <p className="mb-6">
          Each account has a virtual wallet. Any request made will debit the wallet in real time.
          When the wallet balance is zero, requests will return a blocked status.
          Services are charged 0.000001 per request (£1 per credit).
          See the pricing page for more info.
        </p>
      </>
    ),
  },
  {
    title: 'How can I get involved?',
    content: (
      <p>
        Join the community and come ask questions on{' '}
        <a href="https://discord.gg/TBR9bRjd6Z">Discord</a>
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
      <h2 className="font-bold text-3xl text-center text-white">FAQs</h2>
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
