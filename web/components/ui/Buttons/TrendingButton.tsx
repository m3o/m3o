import type { FC } from 'react'
import Link from 'next/link'
import { Routes } from '@/lib/constants'
import TrendingUpIcon from '@heroicons/react/outline/TrendingUpIcon'

export const TrendingButton: FC = () => {
  return (
    <Link href={Routes.Trending}>
      <a className="inverse-btn w-12 h-12 md:w-auto md:h-auto">
        <TrendingUpIcon className="w-6 md:mr-4" />
        <span className="hidden md:block">Trending</span>
      </a>
    </Link>
  )
}
