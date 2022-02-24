import type { FC } from 'react'
import React from 'react'
import { CodeBlock } from '@/components/ui'

interface Props {
  code: string
}

export const ResponseBlock: FC<Props> = ({ code }) => {
  return (
    <div className="bg-zinc-800 border border-solid dark:border-zinc-700 rounded-lg mt-6 items-center">
      <div className="p-4 border-b border-solid border-zinc-700 flex justify-between items-center">
        <p className="text-white text-sm font-medium mb-0">Response</p>
      </div>
      <CodeBlock code={code} language="json" />
    </div>
  )
}
