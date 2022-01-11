import type { FC } from 'react'
import { TrashIcon } from '@heroicons/react/outline'

interface Props {
  onClick: VoidFunction
}

export const DeleteButton: FC<Props> = ({ onClick, children = 'Delete' }) => {
  return (
    <button
      className="flex items-center text-sm bg-red-600 hover:bg-red-800 py-2 px-4 rounded-md text-white ml-auto font-bold transition-colors"
      onClick={onClick}
    >
      <TrashIcon className="w-6 mr-2" />
      {children}
    </button>
  )
}
