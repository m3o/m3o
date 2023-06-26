import type { FC } from 'react'
import SearchIcon from '@heroicons/react/outline/SearchIcon'

export const NoResults: FC = () => {
  return (
    <section className="text-center">
      <div className="mx-auto bg-zinc-200 dark:bg-zinc-800 inline-block p-4 rounded-md border border-zinc-300 dark:border-zinc-600 mb-4">
        <SearchIcon className="w-6" />
      </div>
      <h1 className="font-bold text-xl text-black dark:text-white mb-2">
        No matching APIs
      </h1>
      <p>We could not find any APIs based on your search.</p>
      <p className="mt-2 mb-16">
        Can&apos;t find what you&apos;re looking for?{' '}
        <a
          href="https://forms.gle/RoYDNQk3myArHfZM9"
          target="_blank"
          rel="noreferrer">
          Let us know.
        </a>
      </p>
    </section>
  )
}
