import Link from 'next/link'
import { ArrowRightIcon, UserIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { ChevronDownIcon } from '@heroicons/react/outline'
import {
  useClickOutside,
  useLogout,
  useGetCurrentBalance,
  useBillingAccount,
} from '@/hooks'
import { LOGGED_IN_MENU_ITEMS } from './Header.constants'

interface LoggedInMenuProps {
  user: Account
}

export const LoggedInMenu: FC<LoggedInMenuProps> = ({ user }) => {
  const currentBalance = useGetCurrentBalance()
  const [open, setOpen] = useState(false)
  const logout = useLogout()
  const { subscriptionLevel } = useBillingAccount()

  const clickOutsideRef = useClickOutside({
    trigger: open,
    onClickOutside: () => setOpen(false),
  })

  const chevronClasses = classNames(
    'w-4 ml-2 transition transition-transform',
    {
      ['rotate-180']: open,
    },
  )

  return (
    <div className="relative text-left ml-4 hidden lg:inline-block">
      <button
        type="button"
        className="flex items-center rounded-full border px-2 py-2 dark:bg-zinc-800 font-medium text-zinc-900 tbc dark:text-white"
        aria-haspopup="true"
        onClick={() => setOpen(!open)}>
        <UserIcon className="w-4" />
        <ChevronDownIcon className={chevronClasses} />
      </button>
      {open && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md box"
          role="menu"
          ref={clickOutsideRef}
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}>
          <div className="border-b p-4 py-2 text-sm dark:border-zinc-600 dark:text-white">
            <p>Signed in as</p>
            <p className="font-bold overflow-hidden text-ellipsis">
              {user.name}
            </p>
{/*
            {subscriptionLevel && (
              <p
                className={classNames('capitalize', {
                  'gradient-text font-bold': subscriptionLevel === 'pro',
                })}>
                {subscriptionLevel}
              </p>
            )}
*/}
          </div>
          <div className="px-4 py-2 tbc border-b text-sm text-zinc-700">
            <p className="dark:text-white">Balance</p>
            {currentBalance.isLoading ? (
              <PulseLoader />
            ) : (
              <span className="font-medium text-indigo-600 dark:text-indigo-300">
                {(currentBalance.data || 0).toFixed(6)}
              </span>
            )}
          </div>
          <div className="py-1" role="none">
            {LOGGED_IN_MENU_ITEMS.map(item => (
              <Link href={item.link} key={item.link}>
                <a
                  className="group text-zinc-700 flex items-center justify-between px-4 py-2 text-sm hover:bg-zinc-100 font-medium dark:hover:bg-indigo-700 dark:text-white"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-{{ index }}"
                  onClick={() => setOpen(false)}>
                  {item.text}
                  <ArrowRightIcon className="w-4 opacity-0 group-hover:opacity-100" />
                </a>
              </Link>
            ))}
            <button
              onClick={() => logout.mutate()}
              className="font-medium text-indigo-600 hover:text-zinc-900 px-4 py-2 text-sm dark:hover:text-indigo-300 hover:underline dark:text-indigo-300">
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
