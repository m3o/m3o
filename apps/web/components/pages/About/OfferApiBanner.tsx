import type { FC } from 'react'

export const OfferApiBanner: FC = () => {
  return (
    <section className="bg-white text-white py-6 text-center md:py-16 dark:bg-zinc-800 dark:border-zinc-600">
      <div className="container px-6 mx-auto max-w-xl">
        <h1 className="font-bold text-2xl md:text-3xl mb-6 text-black dark:text-white">
          Offer your API on the M3O platform to an expanded audience
        </h1>
        <p className="mb-4 pt-6">
          <a
            href="https://forms.gle/9SQV6DdLNDzSRQ477"
            className="btn"
            target="_blank"
            rel="noreferrer">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  )
}
