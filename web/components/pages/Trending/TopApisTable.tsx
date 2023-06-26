import type { FC } from 'react'
import Link from 'next/link'
import type { RankApi } from '@/types'
import FireIcon from '@heroicons/react/outline/FireIcon'

interface Props {
  apis: RankApi[]
}

export const TopApisTable: FC<Props> = ({ apis }) => {
  return (
    <div>
      {apis.slice(0, 10).map(api => (
        <div key={api.api_name}>
          <Link href={`/${api.api_name}`}>
            <a className="flex items-center bg-white p-6 rounded-md mb-4 shadow dark:bg-zinc-900 hover:shadow-md text-zinc-600 hover:no-underline">
              <span className="bg-zinc-100 w-10 h-10 flex items-center justify-center rounded-md mr-4 dark:bg-zinc-800">
                {api.position === 1 ? (
                  <FireIcon className="w-6" />
                ) : (
                  api.position
                )}
              </span>
              {api.api_display_name}
            </a>
          </Link>
        </div>
      ))}
    </div>
  )
}
