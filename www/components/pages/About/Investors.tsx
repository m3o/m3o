/* eslint @next/next/no-img-element:0 */
import type { FC } from 'react'

interface InvestorItem {
  alt: string
  src: string
  backgroundColor: string
  link: string
  name: string
  width: number
  height: number
  subTitle?: string
}

const MAIN_INVESTORS: InvestorItem[] = [
  {
    alt: 'Blossom logo',
    backgroundColor: '#000b1e',
    height: 43,
    link: 'https://www.blossomcap.com',
    name: 'Blossom Capital',
    src: '/investors/blossom-logo.svg',
    width: 185,
  },
  {
    alt: 'Lightspeed Logo',
    backgroundColor: '#FBF9F0',
    height: 186.82,
    link: 'https://lsvp.com/',
    name: 'Lightspeed',
    src: '/investors/lightspeed-logo.svg',
    width: 665.21,
  },
  {
    alt: 'Dig Logo',
    backgroundColor: '#000E24',
    height: 400,
    link: 'https://www.dig.ventures/',
    name: 'Dig Ventures',
    src: '/investors/dig-logo.png',
    width: 400,
    subTitle: 'Ross Mason / Founder Mulesoft',
  },
]

const ANGEL_INVESTORS: InvestorItem[] = [
  {
    alt: 'Spencer Kimball',
    backgroundColor: '#fff',
    height: 303,
    link: 'https://www.linkedin.com/in/spencerwkimball/',
    name: 'Spencer Kimball',
    src: '/investors/spencer-kimball.jpeg',
    width: 303,
    subTitle: 'CEO Cockroach Labs',
  },
  {
    alt: 'Luke Kanies',
    backgroundColor: '#fff',
    height: 800,
    link: 'https://www.linkedin.com/in/lukekanies/',
    name: 'Luke Kanies',
    src: '/investors/luke-kanies.jpeg',
    subTitle: 'Founder Puppet Labs',
    width: 800,
  },
  {
    alt: 'Patrick Malatack',
    backgroundColor: '#fff',
    height: 450,
    link: 'https://www.linkedin.com/in/patrickmalatack/',
    name: 'Patrick Malatack',
    src: '/investors/patrick-malatack.jpeg',
    subTitle: 'Angel Investor',
    width: 450,
  },
  {
    alt: 'Charles Fitzgerald',
    backgroundColor: '#fff',
    height: 397,
    link: 'https://www.linkedin.com/in/charlesfitz/',
    name: 'Charles Fitzgerald',
    src: '/investors/charles-fitz.jpeg',
    subTitle: 'Angel Investor',
    width: 397,
  },
]

export const Investors: FC = () => {
  return (
    <section className="py-8 md:py-16  border-t border-zinc-300 dark:border-zinc-600">
      <div className="m3o-container">
        <h1 className="font-bold text-2xl md:text-3xl text-center mb-8 dark:text-white text-black">
          Investors
        </h1>
        <ul className="grid grid-flow-row items-center text-center md:grid-cols-3 gap-4">
          {MAIN_INVESTORS.map(investor => (
            <li key={investor.name} className="mb-4 md:m-6">
              <a href={investor.link} target="_blank" rel="noreferrer">
                <div
                  className="w-52 h-52 flex items-center justify-center rounded-full mx-auto overflow-hidden"
                  style={{ backgroundColor: investor.backgroundColor }}>
                  <img
                    src={investor.src}
                    alt={investor.alt}
                    width={investor.width}
                    height={investor.height}
                  />
                </div>
                <h2 className="mt-4 inline-block font-medium text-black dark:text-white">
                  {investor.name}
                </h2>
                {investor.subTitle && (
                  <h3 className="text-zinc-500 text-sm">{investor.subTitle}</h3>
                )}
              </a>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-2 grid-flow-row items-center text-center lg:grid-cols-4 gap-4 mt-6">
          {ANGEL_INVESTORS.map(investor => (
            <li key={investor.name} className="mb-4 md:m-6">
              <a href={investor.link} target="_blank" rel="noreferrer">
                <div
                  className="w-32 h-32 flex items-center justify-center rounded-full mx-auto overflow-hidden"
                  style={{ backgroundColor: investor.backgroundColor }}>
                  <img
                    src={investor.src}
                    alt={investor.alt}
                    width={investor.width}
                    height={investor.height}
                  />
                </div>
                <h2 className="mt-4 inline-block font-medium text-black dark:text-white">
                  {investor.name}
                </h2>
                {investor.subTitle && (
                  <h3 className="text-zinc-500 text-sm">{investor.subTitle}</h3>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
