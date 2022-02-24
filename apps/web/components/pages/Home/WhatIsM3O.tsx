import type { FC } from 'react'

import { DescriptionHeading } from './DescriptionHeading'
import { GradientHeading } from '../../ui/GradientHeading'

export const WhatIsM3O: FC = ({ children }) => {
  return (
    <section className="bg-white py-28 relative dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
      <div className="m3o-container sm p-8 md:p-16 text-center bg-zinc-100 rounded-lg dark:bg-zinc-900">
        <DescriptionHeading>What is M3O?</DescriptionHeading>
        <GradientHeading
          heading="h4"
          className="text-3xl md:text-4xl mx-auto my-6 max-w-2xl">
          ONE platform, ONE account, ONE framework
        </GradientHeading>
        <h5 className=" max-w-xl mx-auto mb-16">
          Whether you&apos;re building your next product or integrating new
          functionality into an existing one, we&apos;ve got you covered.
        </h5>
        {children}
      </div>
    </section>
  )
}
