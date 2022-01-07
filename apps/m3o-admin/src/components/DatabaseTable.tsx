import type { FC } from 'react'
import { TrashIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'

interface Props {
  name: string
  onDeleteClick: VoidFunction
}

export const DatabaseTable: FC<Props> = ({ name, onDeleteClick }) => {
  return (
    <div className="border-black border-2 p-4 mb-4 rounded-md">
      <div className="flex justify-between">
        <Link to={`/database/${name}`}>{name}</Link>
        <div>
          <button onClick={onDeleteClick}>
            <TrashIcon className="w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
