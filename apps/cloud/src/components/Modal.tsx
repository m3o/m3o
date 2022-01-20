import type { FC } from 'react'
import { XIcon } from '@heroicons/react/outline'

export interface Props {
  handleClose: VoidFunction
}

export const Modal: FC<Props> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <span className="bg-zinc-900 inset-0 absolute bg-opacity-70" />
      <div className="relative z-10 p-6 border border-zinc-700 rounded-md bg-zinc-900">
        <button>
          <XIcon className="w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}
