import type { FC } from 'react'
import { AddAppLink } from './AddAppLink'

export const NoApps: FC = () => {
  return (
    <div className="bg-zinc-800 w-full mt-8 p-10 rounded-md text-center">
      <h2 className="font-bold text-2xl">No Apps Found</h2>
      <AddAppLink className="mt-6" />
    </div>
  )
}
