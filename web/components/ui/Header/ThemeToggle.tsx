import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/outline'

export const ThemeToggle: FC = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  function onClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) return null

  return (
    <button
      className="p-2 ml-4 rounded-md transition-colors hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:text-white"
      onClick={onClick}>
      {theme === 'dark' ? (
        <SunIcon className="w-4" />
      ) : (
        <MoonIcon className="w-4" />
      )}
    </button>
  )
}
