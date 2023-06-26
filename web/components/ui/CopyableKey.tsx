import type { FC } from 'react'
import ClipboardCopyIcon from '@heroicons/react/outline/ClipboardCopyIcon'
import CheckIcon from '@heroicons/react/outline/CheckIcon'
import { useCopyToClipboard } from '@/hooks'
import { Spinner } from '@/components/ui'

interface Props {
  isLoading?: boolean
}

export const CopyableKey: FC<Props> = ({ isLoading = false, children }) => {
  const { copy, copied } = useCopyToClipboard()

  return (
    <div className="relative rounded-md text-zinc-600 bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 font-medium">
      <p
        className="text-sm overflow-x-scroll md:overflow-x-auto p-4"
        onDoubleClick={() => copy(children as string)}>
        {isLoading ? <Spinner /> : children}
      </p>
      <button
        className="absolute top-0 right-0 p-2 text-xs flex items-center rounded-md dark:bg-zinc-600 bg-zinc-300"
        onClick={() => copy(children as string)}>
        {copied ? (
          <>
            <CheckIcon className="w-4 text-green-600" />
          </>
        ) : (
          <>
            <ClipboardCopyIcon className="w-4" />
          </>
        )}
      </button>
    </div>
  )
}
