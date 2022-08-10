import type { FC } from 'react'

import { DescriptionHeading } from './DescriptionHeading'
import { GradientHeading } from '../../ui/GradientHeading'
import { Routes } from '@/lib/constants'
import Link from 'next/link'

export const WhatIsM3O: FC = ({ children }) => {
  return (
    <section className="relative text-zinc-600 dark:text-zinc-400 bg-black pb-20">
      <div className="m3o-container sm p-8 md:p-10   text-center bg-zinc-100 rounded-lg dark:bg-zinc-900">
        <h2 className="font-bold text-3xl text-center text-white mb-8">Explore Services</h2>
        {children}
        <Link href={Routes.Explore} key={Routes.Explore}>
          <a className="inline-flex items-center justify-center btn w-full text-center mt-8 md:w-auto md:mx-auto">
            Browse all
          </a>
         </Link>
      </div>
    </section>
  )
}
