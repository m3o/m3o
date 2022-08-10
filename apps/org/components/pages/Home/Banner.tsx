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
    <section className="px-4 md:px-0 py-12 md:pt-36 mt:pb-10 text-zinc-600 dark:text-zinc-400 bg-gradient-to-b from-zinc-900 to-black">
      <div className="md:max-w-4xl lg:max-w-7xl text-center mx-auto w-11/12 mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto font-bold text-white">
          {heading}
        </h1>
        <h2 className="text-md md:text-lg max-w-2xl mx-auto text-zinc-300">
          {subHeading}
        </h2>
        <div className="mt-10 md:flex items-center max-w-lg mx-auto">
          {/*
          {BANNER_LINKS.map(service => (
            <Link href={service.link} key={service.link}>
              <a className="inline-flex items-center justify-center btn w-full text-center mb-4 md:w-auto md:mx-auto">
                {service.text}
              </a>
            </Link>
          ))}
          */}
          <Link href="https://play.google.com/store/apps/details?id=com.m3o.mobile">
          <a class="inline-flex w-48 h-14 bg-black text-white rounded-lg items-center justify-center w-full btn md:w-auto md:mx-auto border hover:no-underline">
            <div class="mr-3">
                <svg viewBox="30 336.7 120.9 129.2" width="30">
                    <path fill="#FFD400" d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"/>
                    <path fill="#FF3333" d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"/>
                    <path fill="#48FF48" d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"/>
                    <path fill="#3BCCFF" d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"/>
                </svg>
            </div>
            <div>
              <div class="text-xs text-white">GET IT ON</div>
              <div class="text-xl font-semibold font-sans -mt-1 text-white">Google Play</div>
            </div>
          </a>
          </Link>
        </div>
      </div>
    </section>
  )
}
