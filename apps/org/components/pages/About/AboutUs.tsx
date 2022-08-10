import type { FC } from 'react'
import Link from 'next/link'

export const AboutUs: FC = () => {
  return (
    <section className="py-8 md:py-16 dark:bg-zinc-900 border-t dark:border-zinc-600 ">
      <div className="m3o-container">
        <h1 className="font-bold text-2xl md:text-3xl text-center mb-8 dark:text-white text-black">
          About Us
        </h1>
        <div className="md:grid md:grid-cols-6 text-zinc-800 font-light dark:text-zinc-300">
          <div className="mb-6 md:mb-0 col-start-3 col-span-2">
            <p className="mb-4">
              In 2013 we worked at Hailo, a ride hailing startup in
              London, competing against Uber. It&apos;s there we saw 
              the potential of a super app for consumer services.
            </p>
          </div>
          <div className="mb-6 md:mb-0 col-start-3 col-span-2">
            <p className="mb-4">
              Micro started as an open source project designed
              to replicate the Hailo technology platform. 
              That however only solved one half of the problem.
            </p>
          </div>
          <div className="col col-start-3 col-span-2">
            <p className="mb-4">
              M3O is a new community based super app built for developers.
              We're creating a universal experience we can all contribute
              to and build together.
            </p>
          </div>
        </div>
        <div className="text-center max-w-xs mt-4 mx-auto dark:text-zinc-300">
          <p>
            <Link href="/register">
              <a className="text-indigo-500 underline">Signup</a>
            </Link>
            {' ' }to try it out.
          </p>
        </div>
      </div>
    </section>
  )
}
