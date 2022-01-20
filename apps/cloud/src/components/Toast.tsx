import type { FC } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import classnames from 'classnames'

interface Props {
  type: 'Success' | 'Error'
  message: string
  open: boolean
}

export const Toast: FC<Props> = ({ message, type, open }) => {
  const classes = classnames(
    'fixed bottom-4 right-0 p-6 bg-zinc-900 border border-zinc-600 rounded-md flex items-start text-white transition-transform',
    {
      'translate-x-full': !open,
      '-translate-x-4': open
    }
  )
  return (
    <div className={classes}>
      <span className="bg-green-400 block p-2 rounded-full text-black">
        <CheckIcon className="w-4" />
      </span>
      <div className="pl-4">
        <p className="font-medium mb-1">{type}!</p>
        <p>{message}</p>
      </div>
    </div>
  )
}
