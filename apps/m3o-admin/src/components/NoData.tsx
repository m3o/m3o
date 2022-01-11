import type { FC } from 'react'

export const NoData: FC = () => {
  return (
    <div className="flex w-full py-10 items-center justify-center">
      <p className="px-4 py-2 bg-gray-800 text-gray-500 text-sm rounded-md">
        No data found
      </p>
    </div>
  )
}
