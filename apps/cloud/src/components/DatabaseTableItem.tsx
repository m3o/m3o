import type { FC } from 'react'
import { TableIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'

interface Props {
  name: string
}

export const DatabaseTableItem: FC<Props> = ({ name }) => {
  return (
    <div className="mb-6 md:mb-0 text-left relative card hover:shadow-lg transition-shadow border rounded-md p-6">
      <Link
        to={`/database/${name}`}
        className="absolute top-0 left-0 w-full h-full z-30"
      ></Link>
      <p className="flex items-center">
        <TableIcon className="w-6 mr-4" />
        {name}
      </p>
    </div>
  )
}
