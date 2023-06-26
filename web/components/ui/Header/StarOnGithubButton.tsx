import type { FC } from 'react'
import StarIcon from '@heroicons/react/outline/StarIcon'

export const StarOnGithubButton: FC = () => {
  return (
    <a
      href="https://github.com/m3o/m3o"
      target="_blank"
      rel="noreferrer"
      className="flex items-center font-medium border border-zinc-300 p-3 rounded-md ml-4 text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs lg:text-sm dark:border-indigo-300 dark:text-indigo-300">
      <StarIcon className="w-6 mr-4" /> Star us on Github
    </a>
  )
}
