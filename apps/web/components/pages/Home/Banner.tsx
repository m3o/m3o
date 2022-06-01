import type { ReactElement } from 'react'
import Link from 'next/link'
import { Routes } from '@/lib/constants'
import { GradientHeading } from '../../ui/GradientHeading'

interface BannerLink {
  text: string
  link: Routes
}

export interface BannerProps {
  heading: string
  subHeading: string
}

const BANNER_LINKS: BannerLink[] = [
  {
    text: 'Request Access',
    link: 'https://discord.gg/TBR9bRjd6Z',
  },
]

export function Banner({ heading, subHeading }: BannerProps): ReactElement {
  return (
    <section className="px-4 md:px-0 py-12 md:pt-36 mt:pb-10 text-zinc-600 dark:text-zinc-400 bg-gradient-to-b from-zinc-900 to-black">
      <div className="md:max-w-4xl lg:max-w-7xl text-center mx-auto w-11/12 mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto font-bold text-white">
          {heading}
        </h1>
        <h2 className="text-md md:text-lg max-w-2xl mx-auto text-zinc-300">
          {subHeading}
        </h2>
        <div className="mt-10 md:flex items-center max-w-lg mx-auto">
          {BANNER_LINKS.map(service => (
            <Link href={service.link} key={service.link}>
              <a className="inline-flex items-center justify-center btn w-full text-center mb-4 md:w-auto md:mx-auto">
                {service.text}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
