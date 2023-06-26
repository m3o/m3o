import type { FC } from 'react'

export const OfferApiBanner: FC = () => {
  return (
    <section className="bg-white text-white py-6 text-center md:py-16 dark:bg-zinc-800 dark:border-zinc-600">
      <div className="container px-6 mx-auto max-w-xl">
        <h1 className="font-bold text-2xl md:text-3xl mb-6 text-black dark:text-white">
          Publish your API on M3O
        </h1>
        <p className="mb-4 pt-6">
          <a
            href="mailto:contact@m3o.com?subject=M3O API Publisher Programme"
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
