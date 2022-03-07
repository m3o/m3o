import type { FC } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import Link from 'next/link'

interface Props {
  href: string
}

export const BackButtonLink: FC<Props> = ({ children, href }) => {
  return (
    <Link href={href}>
      <a className="flex mb-6 text-sm">
        <ChevronLeftIcon className="w-4" /> {children}
      </a>
    </Link>
  )
}
