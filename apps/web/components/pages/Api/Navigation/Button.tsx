import type { FC } from 'react'
import classnames from 'classnames'

interface Props {
  className?: string
  onClick: VoidFunction
}

export const Button: FC<Props> = ({ className, onClick, children }) => {
  const classes = classnames(
    'py-4 block text-sm text-zinc-400 hover:text-indigo-600 transition-colors',
    className,
  )

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  )
}
