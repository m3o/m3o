import type { FC } from 'react'
import { useV1Token } from '@/hooks'

export const PersonalToken: FC = () => {
  const v1Token = useV1Token()

  return (
    <div className="mt-8 tbgc p-8 md:p-10 rounded-lg">
      <h1 className="font-bold text-xl text-black md:text-2xl dark:text-white">
        Personal Token
      </h1>
      <p className="my-4 ttc text-sm md:text-base">
        Note: This token expires on logout. For long term use we recommend
        generating a scoped API key below.
      </p>
      <div className="font-mono text-sm mt-4 p-4 bg-zinc-700 text-white rounded-md  whitespace-nowrap overflow-x-scroll">
        {v1Token}
      </div>
    </div>
  )
}
