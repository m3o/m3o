import type { FC } from 'react'

export const DescriptionHeading: FC = ({ children }) => {
  return (
    <h3 className="text-lg font-medium uppercase text-zinc-600 dark:text-white">
      {children}
    </h3>
  )
}
