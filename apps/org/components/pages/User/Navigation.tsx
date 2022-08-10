import type { FC } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavigationPropsLink {
  name: string
  pathname: string
}

const USER_LINKS: NavigationPropsLink[] = [
  {
    name: 'Billing',
    pathname: '/account/billing',
  },
  {
    name: 'Tokens',
    pathname: '/account/tokens',
  },
]

const SELECTED_LINK_CLASSES =
  'border-indigo-800 text-indigo-800 dark:border-indigo-400'

const UNSELECTED_LINK_CLASSES = 'border-transparent text-zinc-400 font-normal'

export const UserNavigation: FC = () => {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center mt-6 md:mt-12">
      <ul className="flex items-center font-medium text-sm">
        {USER_LINKS.map(item => (
          <li className="mr-8" key={item.name}>
            <Link href={item.pathname}>
              <a
                className={classnames(
                  'py-4 border-b-2 border-solid block font-bold',
                  {
                    [SELECTED_LINK_CLASSES]: router.pathname === item.pathname,
                    [UNSELECTED_LINK_CLASSES]: true,
                  },
                )}>
                {item.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
