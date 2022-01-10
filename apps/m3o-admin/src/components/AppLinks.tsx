import type { FC, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'
import { useResolvedPath, useMatch, useLocation } from 'react-router-dom'
import { DatabaseIcon, UserIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

interface LinkItem {
  icon: ReactNode
  to: string
}

const LINKS: LinkItem[] = [
  {
    icon: <DatabaseIcon className="w-5" />,
    to: '/database'
  },
  {
    icon: <UserIcon className="w-5" />,
    to: '/users'
  }
]

function CustomLink({ children, to, ...props }: LinkProps) {
  const location = useLocation()
  const match = location.pathname.includes(to as string)

  const classes = classnames(
    'text-white bg-gray-800 border h-12 flex items-center justify-center rounded-md',
    {
      'border-indigo-600 text-indigo-600': match,
      'border-gray-700': !match
    }
  )

  return (
    <Link to={to} {...props} className={classes}>
      {children}
    </Link>
  )
}

export const AppLinks: FC = () => {
  return (
    <ul>
      {LINKS.map((link) => (
        <li key={link.to} className="mb-2">
          <CustomLink to={link.to} key={link.to}>
            {link.icon}
          </CustomLink>
        </li>
      ))}
    </ul>
  )
}
