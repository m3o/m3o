/* eslint @next/next/no-img-element: 0 */
import type { FC } from 'react'
import Link from 'next/link'
import { Routes } from '@/lib/constants'

export const CloudBanner: FC = () => {
  return (
    <section className="pt-28 text-center overflow-hidden dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
      <div className="m3o-container sm">
        <h3 className="description-heading">M3O Cloud</h3>
        <h4 className="text-4xl my-6 md:text-5xl pb-0 gradient-text font-bold">
          Same M3O, less code.
        </h4>
        <p className="text-xl">
          Manage all your M3O applications and data in one place.
        </p>
        <Link href={Routes.SignUp}>
          <a className="btn inline-block my-6 mb-16">Get Started</a>
        </Link>
        <div className="rounded-t-xl overflow-hidden max-w-6xl bg-zinc-900 dark:border dark:border-zinc-700 w-full -mb-10 px-6">
          <img
            src="/cloud.png"
            className="h-full object-cover object-left w-full"
            alt="M3O - Cloud"
          />
        </div>
      </div>
    </section>
  )
}
