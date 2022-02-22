import type { FC } from 'react'
import Link from 'next/link'
import TrendingUpIcon from '@heroicons/react/outline/TrendingUpIcon'
import { Routes } from '@/lib/constants'

interface Props {
  apiName: string
}

export const Top10UsersButton: FC<Props> = ({ apiName }) => {
  return (
    <Link
      href={{
        pathname: Routes.Trending,
        query: {
          api: apiName,
        },
      }}>
      <a className="inverse-btn w-12 h-12 md:w-auto md:h-auto">
        <TrendingUpIcon className="w-6 md:mr-4" />
        <span className="hidden md:block">Top 10 Users</span>
      </a>
    </Link>
  )
}
