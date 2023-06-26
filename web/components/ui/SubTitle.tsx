import type { FC } from 'react'
import classnames from 'classnames'

interface Props {
  className?: string
}

export const SubTitle: FC<Props> = ({ children, className }) => {
  const classes = classnames(
    'font-bold text-lg mb-6 dark:text-white md:text-xl text-black',
    className,
  )

  return <h2 className={classes}>{children}</h2>
}
