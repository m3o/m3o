import type { FC, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { DatabaseIcon, UserIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

interface LinkItem {
  icon: ReactNode
  to: string
  text: string
}

const LINKS: LinkItem[] = [
  {
    icon: <DatabaseIcon className="w-5 mr-2" />,
    to: '/database',
    text: 'DB'
  },
  {
    icon: <UserIcon className="w-5 mr-2" />,
    to: '/users',
    text: 'Users'
  }
]

function CustomLink({ children, to, ...props }: LinkProps) {
  const location = useLocation()
  const match = location.pathname.includes(to as string)

  const classes = classnames('h-12 flex items-center rounded-md text-sm p-4', {
    'border-indigo-600 bg-gray-800 text-white ': match,
    'border-gray-700 text-gray-400': !match
  })

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
            {link.icon} {link.text}
          </CustomLink>
        </li>
      ))}
    </ul>
  )
}
