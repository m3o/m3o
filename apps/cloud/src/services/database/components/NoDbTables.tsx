import type { FC } from 'react'
import { ArrowRightIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'

export const NoDbTables: FC = () => {
  return (
    <div className="p-10">
      <h1 className="font-bold text-4xl">DB</h1>
      <div className="p-10 bg-zinc-800 rounded-lg mt-10 text-center">
        <h2 className="font-bold text-2xl">No DB tables found</h2>
        <Link
          className="btn mt-6 inline-flex items-center"
          data-testid="database-start-link"
          to="/database/add"
        >
          Start <ArrowRightIcon className="w-4 ml-4" />
        </Link>
      </div>
    </div>
  )
}
