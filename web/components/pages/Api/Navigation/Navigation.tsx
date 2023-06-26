import type { FC } from 'react'
import DownloadIcon from '@heroicons/react/outline/DownloadIcon'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from './Button'

interface Props {
  onDownloadsClick: VoidFunction
}

interface NavigationPropsLink {
  name: string
  pathname: string
}

const SERVICE_LINKS: NavigationPropsLink[] = [
  {
    name: 'Overview',
    pathname: '/[api]',
  },
  {
    name: 'API',
    pathname: '/[api]/api',
  },
  {
    name: 'Console',
    pathname: '/[api]/console',
  },
]

export const Navigation: FC<Props> = ({ onDownloadsClick }) => {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center">
      <ul className="tabs no-border">
        {SERVICE_LINKS.map(item => (
          <li key={item.name}>
            <Link
              href={{
                pathname: item.pathname,
                query: { api: router.query.api },
              }}>
              <a
                className={classnames('tab', {
                  selected: router.pathname === item.pathname,
                })}>
                {item.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
