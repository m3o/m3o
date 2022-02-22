import type { FC } from 'react'
import { Alert } from '@/components/ui'
import { useV1Token } from '@/hooks'

export const PersonalToken: FC = () => {
  const v1Token = useV1Token()

  return (
    <div className="mt-8 tbgc p-6 md:p-10 rounded-lg">
      <h1 className="font-bold text-xl text-black md:text-2xl dark:text-white">
        Personal Token
      </h1>
      <p className="my-4 ttc text-sm md:text-base">
        Below is your personal API token. This is used to make requests in the
        UI and can additionally be used for testing purposes or quick API
        integration.
      </p>
      <Alert type="warning">
        Note: This token expires on logout. For long term use we recommend
        generating a scoped API key below.
      </Alert>
      <div className="font-mono text-sm mt-4 p-4 bg-zinc-700 text-white rounded-md  whitespace-nowrap overflow-x-scroll">
        {v1Token}
      </div>
    </div>
  )
}
