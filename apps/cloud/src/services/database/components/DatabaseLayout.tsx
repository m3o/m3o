import type { FC } from 'react'
import classNames from 'classnames'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Spinner } from '../../../components/Spinner'
import { useGetDbTables } from '../hooks/useGetDbTables'

export const DatabaseLayout: FC = () => {
  const { isLoading, data = [] } = useGetDbTables()
  const { pathname } = useLocation()

  return (
    <div className="grid grid-cols-6 h-screen">
      <aside className="border-r border-gray-700 min-h-full col-span-1 text-white">
        <h2 className="font-bold mb-4 p-6">Tables</h2>
        {isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {data.map((item) => (
              <li key={item}>
                <Link
                  to={`/database/${item}`}
                  className={classNames(
                    'block px-6 hover:bg-indigo-800 py-1 text-sm border-r-3',
                    {
                      'bg-zinc-800 border-indigo-600':
                        pathname === `/database/${item}`,
                      'border-transparent': pathname !== `/database/${item}`
                    }
                  )}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
      <div className="col-span-5 ">
        <Outlet />
      </div>
    </div>
  )
}
