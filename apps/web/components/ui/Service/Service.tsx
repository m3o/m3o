import type { FC } from 'react'
import Link from 'next/link'
import { ServiceEndpoints } from './ServiceEndpoints'
import { CategoryBubble } from '@/components/ui'
import { ICONS } from './Service.constants'
import { readme } from './Service.utils'

export const Service: FC<ExploreAPI> = ({
  category,
  display_name,
  endpoints,
  name,
  description,
}) => {
  const Icon = ICONS[name]

  return (
    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow tbc">
      <Link href={`/${name}`}>
        <a className="absolute top-0 left-0 w-full h-full z-30"></a>
      </Link>
      <div className="relative z-40 pointer-events-none p-6 pb-0 md:pb-0">
        <div className="flex items-center justify-between mb-3">
          {Icon && <Icon className="w-5 text-indigo-600 dark:text-pink-400" />}
          {category && <CategoryBubble>{category}</CategoryBubble>}
        </div>
        <h3 className="mt-0 text-2xl mb-1">
          <Link href={`/${name}`}>
            <a
              data-testid={`service-link-${name.toLowerCase()}`}
              className="font-bold text-zinc-900 pointer-events-auto dark:text-white">
              {display_name}
            </a>
          </Link>
        </h3>
        <p className="truncate text-zinc-500 dark:text-zinc-300">
          {readme(name, description)}
        </p>
      </div>
      <ServiceEndpoints serviceName={name} endpoints={endpoints} />
    </div>
  )
}
