import type { FC } from 'react'
import MenuAlt3Icon from '@heroicons/react/outline/MenuAlt3Icon'

interface Props {
  onClick: VoidFunction
}

export const MobileMenuButton: FC<Props> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="ml-4 p-2 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400 lg:hidden rounded-md dark:hover:bg-zinc-700 dark:hover:text-white"
      aria-expanded="false"
      onClick={onClick}>
      <span className="sr-only">Open main menu</span>
      <MenuAlt3Icon className="w-6" />
    </button>
  )
}
