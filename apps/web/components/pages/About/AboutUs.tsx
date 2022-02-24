import type { FC } from 'react'
import Link from 'next/link'

export const AboutUs: FC = () => {
  return (
    <section className="py-8 md:py-16 dark:bg-zinc-900 border-t dark:border-zinc-600 ">
      <div className="m3o-container">
        <h1 className="font-bold text-2xl md:text-3xl text-center mb-8 dark:text-white text-black">
          About Us
        </h1>
        <div className="md:grid md:grid-cols-3 md:gap-4 text-zinc-800 font-light dark:text-zinc-300">
          <div className="mb-6 md:mb-0">
            <p className="mb-4">
              In 2013 we worked at Hailo, a ride hailing startup in
              London, competing against Uber and pushing hard to scale our
              technology. It&apos;s there we cut our teeth on AWS and the cost
              of cloud complexity just to ship an app.
            </p>
          </div>
          <div className="mb-6 md:mb-0">
            <p className="mb-4">
              Micro started life as an open source project to address some of
              those pains. That however only solved one half of the problem.
              It&apos;s not the development of cloud services that&apos;s
              difficult, but how they&apos;re consumed.
            </p>
          </div>
          <div className="col">
            <p className="mb-4">
              M3O is a new cloud platform that focuses
              entirely on the developer experience. We&apos;re building an AWS
              alternative for the next generation of developers powered by Micro
              Services.
            </p>
          </div>
        </div>
        <div className="text-center mt-6 max-w-4xl mx-auto px-4 py-6 rounded-md border border-zinc-300 dark:border-zinc-600">
          <p>
            👉 If you&apos;re interested in what we&apos;re doing,{' '}
            <Link href="/register">
              <a className="text-indigo-500 underline">sign up</a>
            </Link>
            , kick the tyres and send us some feedback.
          </p>
        </div>
      </div>
    </section>
  )
}
