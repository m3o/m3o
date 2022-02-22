import type { FC } from 'react'
import classnames from 'classnames'

interface Props {
  selected?: boolean
  onClick: VoidFunction
}

export const EndpointButton: FC<Props> = ({
  children,
  selected = false,
  onClick,
}) => {
  const classes = classnames(
    'w-full text-left px-4 py-2 text-sm hover:underline text-zinc-500 rounded-sm dark:text-zinc-400',
    {
      'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-200 dark:text-indigo-800':
        selected,
    },
  )

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  )
}
