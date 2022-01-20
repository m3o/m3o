import type { FC } from 'react'

export const Heading1: FC = ({ children }) => {
  return <h1 className="mt-3 text-white font-bold text-4xl">{children}</h1>
}
