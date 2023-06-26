import type { FC, ComponentProps } from 'react'
import classNames from 'classnames'

export const CategoryBubble: FC<ComponentProps<'p'>> = ({
  children,
  className = '',
}) => {
  const classes = classNames(
    'text-xs capitalize text-zinc-50 bg-indigo-600 px-3 py-1 rounded-full',
    className,
  )

  return <p className={classes}>{children}</p>
}
