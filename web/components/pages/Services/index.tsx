import type { FC } from 'react'
import type { ServicesGridProps } from '@/components/ui'
import Link from 'next/link'
import ArrowRightIcon from '@heroicons/react/outline/ArrowRightIcon'
import { ServicesGrid } from '@/components/ui'
import { Routes } from '@/lib/constants'

export interface ServicesProps {
  services: ServicesGridProps['services']
}

export const Services: FC<ServicesProps> = ({ services }) => {
  return (
    <section className="pt-16 pb-16 text-center bg-zinc-50 dark:bg-zinc-800">
      <div className="m3o-container">
        <h1 className="text-black text-center font-bold text-lg md:text-3xl mb-8 dark:text-white">
          Micro APIs for everyday use
        </h1>
        <ServicesGrid services={services} />
        <Link href={Routes.Explore}>
          <a className="inline-flex items-center md:text-lg mt-8">
            Explore all <ArrowRightIcon className="w-4 ml-2" />
          </a>
        </Link>
      </div>
    </section>
  )
}
