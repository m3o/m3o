import type { FC } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { AppLinks } from './AppLinks'

export const Layout: FC = () => {
  return (
    <div className="pl-52">
      <aside className="bg-zinc-900 h-screen fixed top-0 left-0 w-52 border-r border-gray-700">
        <div className="p-6">
          <Link
            to="/"
            className="relative hover:no-underline flex items-center"
          >
            <img src="/logo-white.png" alt="m3o logo" className="w-8" />
            <p className="font-bold text-white ml-2">Cloud</p>
          </Link>
        </div>
        <nav className="m-2">
          <h2 className="pl-4 pb-4 text-gray-500 uppercase text-sm">Manage</h2>
          <AppLinks />
          <h2 className="pl-4 pb-4 text-gray-500 uppercase text-sm mt-8">
            Support
          </h2>
          <a
            href="mailto:support@m3o.com?subject=M3O Cloud Feedback"
            className="h-12 flex items-center rounded-md text-sm p-4 text-gray-400"
          >
            Feedback
          </a>
        </nav>
      </aside>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
