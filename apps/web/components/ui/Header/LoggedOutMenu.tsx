import type { FC } from 'react'
import Link from 'next/link'
import { Routes } from '@/lib/constants'

export const LoggedOutMenu: FC = () => {
  return (
    <div className="flex">
      <div className="hidden lg:flex ml-2 items-center">
        <Link href="/login">
          <a className="font-medium ml-4 text-zinc-800 text-sm hover:text-pink-500 transition-colors dark:text-white">
            Log in
          </a>
        </Link>
      </div>
      <span className="hidden lg:inline-block ml-6">
        <Link href={Routes.SignUp}>
          <a className="px-5 py-3 text-sm text-white dark:text-white font-medium dark:bg-zinc-700 bg-zinc-800 rounded-md flex items-center hover:bg-indigo-600 transition-colors">
            Sign up
          </a>
        </Link>
      </span>
    </div>
  )
}
