import type { ReactElement } from 'react'
import Link from 'next/link'
import { GradientHeading } from '../../ui/GradientHeading'

interface BannerLink {
  text: string
  link: string
}

export interface BannerProps {
  heading: string
  subHeading: string
}

const BANNER_LINKS: BannerLink[] = [
  {
    text: 'Get Started',
    link: '/register',
  },
]

export function Banner({ heading, subHeading }: BannerProps): ReactElement {
  return (
    <section className="px-4 md:px-0 py-12 md:pt-36 mt:pb-10">
      <div className="md:max-w-4xl lg:max-w-7xl text-center mx-auto w-11/12 mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto font-bold">
          {heading}
        </h1>
        <h2 className="text-md md:text-lg max-w-2xl mx-auto">
          {subHeading}
        </h2>
        <div className="mt-10 md:flex items-center max-w-lg mx-auto">
          {BANNER_LINKS.map(service => (
            <Link href={service.link} key={service.link}>
              <a className="inline-flex items-center justify-center btn w-full text-center mb-4  md:w-auto md:mx-auto">
                {service.text}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
