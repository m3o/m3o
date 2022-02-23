import type { FC } from 'react'
import classnames from 'classnames'
import Link from 'next/link'

interface Props {
  className?: string
  href: string
}

export const LinkButton: FC<Props> = ({ href, children, className }) => {
  const classes = classnames('btn', className)

  return (
    <Link href={href}>
      <a className={classes}>{children}</a>
    </Link>
  )
}
