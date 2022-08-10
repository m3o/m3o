import { FC, Fragment } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { XIcon, ChevronDownIcon } from '@heroicons/react/outline'
import {
  LOGGED_IN_MENU_ITEMS,
  LOGGED_OUT_HEADER_LINKS,
  LOGGED_IN_HEADER_LINKS,
} from './Header.constants'
import { useLogout } from '@/hooks'
import { Button } from '../Buttons/Button'

interface MobileMenuProps {
  onClose: VoidFunction
  user: Account | null
}

export const MobileMenu: FC<MobileMenuProps> = ({ onClose, user }) => {
  const logout = useLogout()
  const links = user ? LOGGED_IN_HEADER_LINKS : LOGGED_OUT_HEADER_LINKS

  return (
    <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden z-50">
      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-zinc-900 divide-y-2 divide-zinc-50 dark:divide-zinc-700 border border-transparent dark:border-zinc-600">
        <div className="pt-5 pb-6 px-5">
          <div className="flex items-center">
            <div className="ml-auto">
              <button
                type="button"
                className="bg-white dark:bg-zinc-800 rounded-md p-2 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={onClose}>
                <span className="sr-only">Close menu</span>
                <XIcon className="w-4" />
              </button>
            </div>
          </div>
          <div>
            <nav className="grid gap-y-2 mt-4">
              {links.map(item => {
                if (item.link) {
                  return (
                    <Link href={item.link}>
                      <a
                        className="rounded-md hover:bg-zinc-50 text-zinc-600 p-2 text-sm dark:hover:bg-zinc-800 dark:text-white"
                        onClick={onClose}>
                        {item.text}
                      </a>
                    </Link>
                  )
                }

                return (
                  <Fragment key={item.text}>
                    <button
                      className="rounded-md hover:bg-zinc-50 text-zinc-600 dark:text-white p-2 text-sm dark:hover:bg-zinc-800 text-left flex justify-between items-center"
                      onClick={() => alert(item.text)}>
                      {item.text}{' '}
                      <ChevronDownIcon
                        className={classNames('w-4', {
                          'rotate-180': false,
                        })}
                      />
                    </button>
                  </Fragment>
                )
              })}
              {user && (
                <Fragment>
                  {LOGGED_IN_MENU_ITEMS.map(link => (
                    <Link href={link.link} key={link.link}>
                      <a
                        className="rounded-md hover:bg-zinc-50 text-zinc-600 p-2 text-sm dark:hover:bg-zinc-800 dark:text-white"
                        onClick={onClose}>
                        {link.text}
                      </a>
                    </Link>
                  ))}
                </Fragment>
              )}
            </nav>
          </div>
        </div>
        {user && (
          <div className="py-4 px-5">
            <div className="text-sm">
              <p className="pb-1 font-bold">Logged in as:</p>
              <p className="text-zinc-600 dark:text-zinc-400">{user.name}</p>
              <Button onClick={() => logout.mutate()} className="mt-4 w-full">
                Logout
              </Button>
            </div>
          </div>
        )}
        {!user && (
          <div className="py-4 px-5">
            <Link href="/register">
              <a className="w-full btn mt-2 block text-center">Signup</a>
            </Link>
            <p className="mt-6 text-center text-sm font-medium text-zinc-500">
              Existing customer?{` `}
              <Link href="/login">
                <a className="text-indigo-600 hover:text-indigo-500">Login</a>
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
