import type { FC } from 'react'
import { Outlet, Link } from 'react-router-dom'

export const Layout: FC = () => {
  return (
    <section className="pl-60">
      <aside className="w-60 bg-gray-900 h-screen fixed top-0 left-0">
        <div className="p-6">
          <Link
            to="/"
            className="relative hover:no-underline w-14 flex items-center"
          >
            <img src="/logo-white.png" alt="m3o logo" />
          </Link>
        </div>
        <nav>
          <h3 className="px-6 uppercase text-sm text-gray-600 mt-8 mb-4">
            Manage
          </h3>
          <ul>
            <li>
              <Link to="/database" className="px-6 py-2 block text-white">
                DB
              </Link>
            </li>
            <li>
              <Link to="/users" className="px-6 py-w block text-white">
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </section>
  )
}
