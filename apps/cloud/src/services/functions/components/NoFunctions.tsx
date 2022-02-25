import type { FC } from 'react'
import { AddFunctionLink } from './AddFunctionLink'

export const NoFunctions: FC = () => {
  return (
    <div className="bg-zinc-800 w-full mt-8 p-10 rounded-md text-center">
      <h2 className="font-bold text-2xl">You have not uploaded a function yet.</h2>
      <AddFunctionLink className="mt-6" />
    </div>
  )
}
