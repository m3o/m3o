import type { FC } from 'react'
import { XIcon } from '@heroicons/react/outline'

export interface Props {
  handleClose: VoidFunction
  testId?: string
}

export const Modal: FC<Props> = ({
  children,
  handleClose,
  testId = 'modal'
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      data-testid={testId}
    >
      <span className="bg-zinc-900 inset-0 absolute bg-opacity-70" />
      <div className="relative z-10 p-8 rounded-md bg-zinc-800 flex flex-col">
        <button onClick={handleClose} className="ml-auto mb-6">
          <XIcon className="w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}
