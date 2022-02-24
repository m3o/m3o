/* eslint @next/next/no-img-element:0 */
import type { FC } from 'react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export const Logo: FC = () => {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => setMounted(true), [])

  return mounted ? (
    <img
      src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
      alt="m3o logo"
      width={368}
      height={236}
    />
  ) : null
}
