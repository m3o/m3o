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
    <div className="relative rounded-full text-zinc-600 bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 font-medium">
      <p
        className=" text-sm overflow-x-scroll md:overflow-x-auto p-4"
        onDoubleClick={() => copy(children as string)}>
        {isLoading ? <Spinner /> : children}
      </p>
      {/* <button
        className="absolute top-0 right-0 px-4 py-2 text-xs flex items-center rounded-md hover:text-indigo-400 bg-zinc-100"
        onClick={() => copy(children as string)}>
        {copied ? (
          <>
            Copied <CheckIcon className="w-4 ml-2 text-green-600" />
          </>
        ) : (
          <>
            Copy <ClipboardCopyIcon className="w-4 ml-2" />
          </>
        )}
      </button> */}
    </div>
  )
}
