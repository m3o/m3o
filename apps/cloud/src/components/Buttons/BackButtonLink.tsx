import type { FC } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'

interface Props {
  to: string
}

export const BackButtonLink: FC<Props> = ({ children, to }) => {
  return (
    <Link to={to} className="flex mb-6 text-sm text-white">
      <ChevronLeftIcon className="w-4" /> {children}
    </Link>
  )
}
