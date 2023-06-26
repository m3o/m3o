import type { FC } from 'react'
import classnames from 'classnames'

interface Props {
  onClick: VoidFunction
  selected: boolean
}

export const ExampleButton: FC<Props> = ({ children, onClick, selected }) => {
  const classes = classnames(
    'w-full text-left px-4 py-2 text-sm hover:underline text-zinc-500',
    {
      'bg-indigo-50 font-medium rounded-sm': selected,
    },
  )

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  )
}
