import type { FC } from 'react'
import Link from 'next/link'
import { ICONS } from './Service.constants'
import { readme } from './Service.utils'

export const RecentlyViewedService: FC<ExploreAPI> = ({
  name,
  display_name,
  description,
}) => {
  const Icon = ICONS[name]

  return (
    <div className="flex items-center mb-4 last:mb-0">
      <span className="inline-block bg-zinc-700 p-4 rounded-md">
        {Icon && <Icon className="w-6 text-white" />}
      </span>
      <div className="ml-4">
        <h4 className="font-bold">
          <Link href={`/${name}`}>
            <a className="text-white dark:text-white">{display_name}</a>
          </Link>
        </h4>
        <p className="text-sm text-zinc-400">{readme(name, description)}</p>
      </div>
    </div>
  )
}
