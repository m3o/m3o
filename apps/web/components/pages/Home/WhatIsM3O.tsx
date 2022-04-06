import type { FC } from 'react'

import { DescriptionHeading } from './DescriptionHeading'
import { GradientHeading } from '../../ui/GradientHeading'

export const WhatIsM3O: FC = ({ children }) => {
  return (
    <section className="relative text-zinc-600 dark:text-zinc-400">
      <div className="m3o-container sm p-8 md:p-10   text-center bg-zinc-100 rounded-lg dark:bg-zinc-900">
        {children}
      </div>
    </section>
  )
}
