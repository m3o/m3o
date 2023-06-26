import type { FC } from 'react'
import classnames from 'classnames'

interface Props {
  className?: string
  heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const GradientHeading: FC<Props> = ({
  children,
  heading: Heading = 'h1',
  className,
}) => {
  const classes = classnames(
    'font-bold bg-gradient-to-r from-indigo-800 via-purple-500 to-pink-500 bg-clip-text text-transparent pb-4',
    className,
  )

  return <Heading className={classes}>{children}</Heading>
}
