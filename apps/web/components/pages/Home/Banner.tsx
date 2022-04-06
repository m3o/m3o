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
    text: 'Explore APIs',
    link: Routes.Explore,
  },
  {
    text: 'Playground',
    link: '/playground',
  },
]

export function Banner({ heading, subHeading }: BannerProps): ReactElement {
  return (
    <section className="px-4 md:px-0 py-12 md:py-36 text-zinc-600 dark:text-zinc-400">
      <div className="md:max-w-4xl lg:max-w-7xl text-center mx-auto w-11/12 mb-10">
        <GradientHeading className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto">
          {heading}
        </GradientHeading>
        <h2 className="text-md md:text-lg lg:text-xl max-w-3xl mx-auto text-zinc-300">
          {subHeading}
        </h2>
        <div className="mt-10 md:flex items-center max-w-lg mx-auto">
          {BANNER_LINKS.map(service => (
            <Link href={service.link} key={service.link}>
              <a className="inline-flex items-center justify-center btn w-full text-center mb-4 last:mb-0 md:mb-0 md:mr-4 md:last:mr-0">
                {service.text}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
