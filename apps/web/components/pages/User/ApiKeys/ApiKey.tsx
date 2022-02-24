import type { FC } from 'react'
import format from 'date-fns/format'
import KeyIcon from '@heroicons/react/outline/KeyIcon'
import TrashIcon from '@heroicons/react/outline/TrashIcon'

interface Props extends APIKey {
  canDelete: boolean
  onDelete: VoidFunction
}

export const ApiKey: FC<Props> = ({
  canDelete,
  createdTime,
  description,
  onDelete,
  scopes,
  lastSeen,
}) => {
  return (
    <div className="p-4 mt-6 text-black rounded-md md:flex items-center justify-between bg-white dark:bg-zinc-700 dark:text-white">
      <div>
        <p className="font-bold flex items-center mb-3">
          <KeyIcon className="w-4 mr-2" />
          {description}
        </p>
        <p className="text-xs mb-1 text-zinc-400 mt-1">
          {format(
            new Date(Number(createdTime * 1000)),
            'H:mm:ss iiii do MMMM yyyy',
          )}
        </p>
        <p className="text-xs mb-1 text-zinc-400">
          Scopes: {scopes.length ? scopes.join(', ') : '*'}
        </p>
        <p className="text-xs mb-1 text-zinc-400">
          Last used:{' '}
          {lastSeen > 0
            ? format(
                new Date(Number(lastSeen * 1000)),
                'H:mm:ss iiii do MMMM yyyy',
              )
            : 'never'}
        </p>
      </div>
      {canDelete && (
        <button
          className="flex items-center justify-center bg-red-600 py-2 px-4 rounded-md text-white text-sm mt-4 md:mt-0 w-full md:w-auto"
          onClick={onDelete}>
          <TrashIcon className="w-4 mr-2" />
          Delete
        </button>
      )}
    </div>
  )
}
