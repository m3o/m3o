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
    name: 'About',
    link: '/about',
  },
  {
    name: 'Blog',
    link: 'https://blog.m3o.com',
  },
  {
    name: 'Email',
    link: 'mailto:contact@m3o.com',
  },
  {
    name: 'Github',
    link: 'https://github.com/m3o',
  },
]

const EXTERNAL_LINKS_2: ExternalLink[] = [
  {
    name: 'Discord',
    link: 'https://discord.gg/TBR9bRjd6Z',
  },
  {
    name: 'Instagram',
    link: 'https://www.instagram.com/m3oservices/',
  },
  {
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/company/micro-services-inc',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/m3oservices',
  },
]

export const Footer: FC = () => {
  return (
    <footer className="bg-zinc-100 py-8 md:py-20 dark:bg-zinc-900 border-t tbc">
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
                <Link href="/services">
                  <a className="hover:text-indigo-600 text-zinc-800 transition-colors font-light dark:text-zinc-400 text-sm">
                    API
                  </a>
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-indigo-600 text-zinc-800 transition-colors font-light dark:text-zinc-400 text-sm"
                  href="https://play.google.com/store/apps/details?id=com.m3o.mobile"
                  target="_blank"
                  rel="noreferrer">
                  Mobile
                </a>
              </li>
              <li>
                <a
                  className="hover:text-indigo-600 text-zinc-800 transition-colors font-light dark:text-zinc-400 text-sm"
                  href="https://m3o.com/client"
                  target="_blank"
                  rel="noreferrer">
                  Web
                </a>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="hover:text-indigo-600 text-zinc-800 transition-colors font-light dark:text-zinc-400 text-sm">
                    Pricing
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-sm mt-6 md:mt-20">
        <div className="m3o-container sm">
          <p>© {new Date().getFullYear()} Micro Services, Inc.</p>
        </div>
      </div>
    </footer>
  )
}
