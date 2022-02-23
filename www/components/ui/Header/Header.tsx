/* eslint @next/next/no-img-element:0 */
import type { FC } from 'react'
import { useState, useMemo } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useUser } from '@/providers'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenuButton } from './MobileMenuButton'
import { LoggedInMenu } from './LoggedInMenu'
import { LoggedOutMenu } from './LoggedOutMenu'
import { MobileMenu } from './MobileMenu'
import { Navigation } from '../Navigation'
import { HeaderBanner } from './HeaderBanner'
import {
  LOGGED_OUT_HEADER_LINKS,
  LOGGED_IN_HEADER_LINKS,
} from './Header.constants'
import { Logo } from '../Logo'

export const Header: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const user = useUser()

  const navigationLinks = useMemo(
    () => (user ? [] : LOGGED_OUT_HEADER_LINKS),
    [user],
  )

  return (
    <div className="sticky top-0 z-50">
      <HeaderBanner />
      <header
        className={classNames(
          'p-4 md:p-6 bg-zinc-100 backdrop-blur-sm bg-opacity-75 dark:bg-zinc-900 dark:bg-opacity-75 border-b tbc',
        )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="relative hover:no-underline w-14 flex items-center">
                <Logo />
              </a>
            </Link>
            <Navigation links={navigationLinks} />
          </div>
          <div className="flex items-center">
            <div>{user ? <LoggedInMenu user={user} /> : <LoggedOutMenu />}</div>
            <ThemeToggle />
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <MobileMenu user={user} onClose={() => setMobileMenuOpen(false)} />
      )}
    </div>
  )
}
