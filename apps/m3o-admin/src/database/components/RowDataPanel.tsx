import type { FC } from 'react'
import { TrashIcon } from '@heroicons/react/outline'
import { ExpectedRecord } from '../types'

interface Props {
  data: ExpectedRecord
  onDeleteClick: VoidFunction
}

const keysWithoutIdKey = (data: ExpectedRecord) => {
  return Object.keys(data).filter((key) => key !== 'id')
}

export const RowDataPanel: FC<Props> = ({ data, onDeleteClick }) => {
  return (
    <div>
      <div className="border-b mb-4 pb-4 grid">
        <button
          className="flex items-center text-sm bg-red-600 py-2 px-4 rounded-md text-white ml-auto font-bold"
          onClick={onDeleteClick}
        >
          <TrashIcon className="w-6 mr-2" />
          Delete
        </button>
      </div>
      <h1 className="font-bold mb-6">
        <span className="block text-gray-400">ID:</span>
        {data.id}
      </h1>
      {keysWithoutIdKey(data).map((key) => (
        <div key={key}>
          <h2 className="mb-1 text-sm pb-1 font-medium">{key}</h2>
          <p className="mb-6 text-gray-500 text-sm">
            {typeof data[key] === 'object'
              ? JSON.stringify(data[key])
              : data[key]}
          </p>
        </div>
      ))}
    </div>
  )
}
