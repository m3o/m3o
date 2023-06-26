import type { FC } from 'react'
import Link from 'next/link'

export const AboutUs: FC = () => {
  return (
    <section className="py-8 md:py-16 dark:bg-zinc-900 border-t dark:border-zinc-600 ">
      <div className="m3o-container">
        <h1 className="font-bold text-2xl md:text-3xl text-center mb-8 dark:text-white text-black">
          About Us
        </h1>
        <div className="md:grid md:grid-cols-1 m-auto max-w-md md:gap-4 text-zinc-800 font-light dark:text-zinc-300">
          <div className="mb-6 md:mb-0">
            <p className="mb-4">
              M3O is a community led cloud platform that focuses
              entirely on the developer experience. We&apos;re building an AWS
              alternative for the next generation of developers.
            </p>
          </div>
          <div className="mb-6 md:mb-0">
            <p className="mb-4">
              Almost a decade ago, at the ride hailing startup Hailo, we cut our teeth on 
	      AWS and the cost of cloud complexity just to ship a mobile app to end consumers.
            </p>
          </div>
          <div className="mb-6 md:mb-0">
            <p className="mb-4">
              M3O started life as Micro, an open source project built to address
              those pains. Now we're leveraging it to offer Micro services as 
	      reusable building blocks for everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
