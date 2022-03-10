import type { FC } from 'react'
import { CopyableKey } from '@/components/ui'

interface Props {
  apiToken: string
}

export const APIKey: FC<Props> = ({ apiToken }) => {
  return (
    <div className="tbgc p-6 md:p-10 rounded-lg">
      <h5 className="font-bold text-xl text-black dark:text-white">
        Your Personal API Key
      </h5>
      <p className="italic text-sm mt-2 text-zinc-500 mb-6">
        Please note: This will be destroyed on logout
      </p>
      <CopyableKey>{apiToken}</CopyableKey>
    </div>
  )
}
