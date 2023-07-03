/* eslint @next/next/no-img-element:0 */
import type { FC } from 'react'
import Link from 'next/link'
import { ExternalLinks } from './ExternalLinks'
import { Logo } from '../Logo'

interface ExternalLink {
  name: string
  link: string
}

const EXTERNAL_LINKS_1: ExternalLink[] = [
  {
    name: 'Blog',
    link: 'https://blog.m3o.com',
  },
  {
    name: 'Email',
    link: 'mailto:contact@m3o.com',
  },
  {
    name: 'GitHub',
    link: 'https://github.com/m3o',
  },
]

const EXTERNAL_LINKS_2: ExternalLink[] = [
  {
    name: 'Discord',
    link: 'https://discord.gg/TBR9bRjd6Z',
  },
  {
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/company/m3o-com',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/m3ocloud',
  },
]

export const Footer: FC = () => {
  return (
    <footer className="bg-zinc-100 py-8 md:py-20 border-t dark:bg-zinc-900 tbc">
      <div className="m3o-container sm">
        <div className="md:grid md:grid-cols-4">
          <div className="mb-6 md:mb-0">
            <a className="relative hover:no-underline w-14 flex items-center">
              <Logo />
            </a>
          </div>
          <ExternalLinks externalLinks={EXTERNAL_LINKS_1} title="Company" />
          <ExternalLinks externalLinks={EXTERNAL_LINKS_2} title="Social" />
          <div className="mb-4 md:mb-0">
            <h5 className="text-black font-medium mb-2 dark:text-white">
              Product
            </h5>
            <ul>
              <li>
                <Link href="/explore">
                  <a className="hover:text-indigo-600 text-zinc-800 transition-colors font-light dark:text-zinc-400 text-sm">
                    Explore
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="hover:text-indigo-600 text-zinc-800 transition-colors font-light dark:text-zinc-400 text-sm">
                    Pricing
                  </a>
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-indigo-600 text-zinc-800 transition-colors font-light dark:text-zinc-400 text-sm"
                  href="https://status.m3o.com"
                  target="_blank"
                  rel="noreferrer">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-sm mt-6 md:mt-20">
        <div className="m3o-container sm">
          <p>© {new Date().getFullYear()} Micro Services Network Limited</p>
        </div>
      </div>
    </footer>
  )
}
