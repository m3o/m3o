import type { FC } from 'react'
import classnames from 'classnames'
import Link from 'next/link'

interface Props {
  className?: string
  href: string
  onClick?: VoidFunction
}

export const LinkButton: FC<Props> = ({
  href,
  children,
  className,
  onClick,
}) => {
  const classes = classnames('btn dark:text-white', className)

  return (
    <Link href={href}>
      <a className={classes} onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}
