/* eslint @next/next/no-img-element:0 */
import type { FC } from 'react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export const Logo: FC = () => {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState()

  useEffect(() => setMounted(true), [])

  return mounted ? (
    <img
      src="/logo-white.png"
      alt="m3o logo"
      width={368}
      height={236}
      className="bg-black border border-black"
    />
  ) : null
}
