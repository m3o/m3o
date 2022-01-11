import type { FC } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { AppLinks } from './AppLinks'

export const Layout: FC = () => {
  return (
    <div className="pl-16">
      <aside className="bg-gray-900 h-screen fixed top-0 left-0 w-16 border-r border-gray-700">
        <div className="p-4">
          <Link
            to="/"
            className="relative hover:no-underline w-8 flex items-center"
          >
            <img src="/logo-white.png" alt="m3o logo" />
          </Link>
        </div>
        <nav className="m-2">
          <AppLinks />
        </nav>
      </aside>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
