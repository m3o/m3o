import type { FC, ComponentType, ComponentProps } from 'react'
import type { LinkProps } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {
  DatabaseIcon,
  UserIcon,
  CodeIcon,
  TerminalIcon
} from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

interface LinkItem {
  icon: ComponentType<ComponentProps<'svg'>>
  to: string
  text: string
}

const LINKS: LinkItem[] = [
  {
    icon: DatabaseIcon,
    to: '/database',
    text: 'DB'
  },
  {
    icon: UserIcon,
    to: '/users',
    text: 'Users'
  },
  {
    icon: CodeIcon,
    to: '/functions',
    text: 'Functions'
  },
  {
    icon: TerminalIcon,
    to: '/apps',
    text: 'Apps'
  }
]

function CustomLink({ children, to, ...props }: LinkProps) {
  const location = useLocation()
  const match = location.pathname.includes(to as string)

  const classes = classnames('h-8 flex items-center rounded-md text-sm p-4', {
    'border-indigo-600 bg-zinc-800 text-indigo-400': match,
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
      {LINKS.map(({ icon: Icon, ...link }) => (
        <li key={link.to} className="mb-2">
          <CustomLink to={link.to} key={link.to}>
            <Icon className="w-4 mr-2" /> {link.text}
          </CustomLink>
        </li>
      ))}
    </ul>
  )
}
