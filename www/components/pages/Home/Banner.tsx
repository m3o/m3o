import type { FC } from 'react'
import Link from 'next/link'
import { Routes } from '@/lib/constants'
import { GradientHeading } from '../../ui/GradientHeading'

interface BannerLink {
  text: string
  link: Routes
}

const BANNER_LINKS: BannerLink[] = [
  {
    text: 'Get Started',
    link: Routes.SignUp,
  },
  {
    text: 'Explore APIs',
    link: Routes.Explore,
  },
]

export const Banner: FC = () => {
  return (
    <section className="px-4 md:px-0 py-12 md:py-36 text-zinc-600 dark:text-zinc-400">
      <div className="md:max-w-4xl lg:max-w-7xl text-center mx-auto w-11/12 mb-10">
        <GradientHeading className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto">
          Everything as a Service
        </GradientHeading>
        <h2 className="text-md md:text-lg lg:text-xl font-medium max-w-3xl mx-auto">
          Explore, discover and consume public APIs as simpler programmable
          building blocks all on one platform for a 10x developer experience.
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
