import type { FC } from 'react'
import XIcon from '@heroicons/react/outline/XIcon'

interface Props {
  onClose: VoidFunction
}

export const CloseButton: FC<Props> = ({ onClose }) => {
  return (
    <button
      type="button"
      className="bg-white dark:bg-zinc-800 rounded-md p-2 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      onClick={onClose}>
      <span className="sr-only">Close menu</span>
      <XIcon className="w-4" />
    </button>
  )
}
