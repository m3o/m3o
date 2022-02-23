import type { FC } from 'react'
import { SellingPointProps } from './SellingPoints.types'

export const SellingPoint: FC<SellingPointProps> = ({
  description,
  Icon,
  title,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-md mb-4 dark:bg-zinc-800 dark:text-white text-zinc-700 dark:border-zinc-600 border border-zinc-300">
      <div className="flex items-center mb-4">
        <Icon className="w-6 mr-2 block" />
        <h4 className="font-bold text-xl text-black dark:text-white">
          {title}
        </h4>
      </div>
      <p>{description}</p>
    </div>
  )
}
