import type { FC } from 'react'
import classnames from 'classnames'

interface Props {
  className?: string
  href: string
}

export const ExternalLinkButton: FC<Props> = ({
  href,
  children,
  className,
}) => {
  const classes = classnames('btn', className)

  return (
    <a className={classes} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}
