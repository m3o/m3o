import type { FC } from 'react'
import DocumentDownloadIcon from '@heroicons/react/outline/DocumentDownloadIcon'
import format from 'date-fns/format'

export const HistoryItem: FC<Adjustment> = ({
  created,
  reference,
  delta,
  meta,
}) => {
  const date = parseInt(created, 10) * 1000

  return (
    <div className="p-4 mt-2 text-black rounded-md flex items-center justify-between bg-white dark:bg-zinc-900">
      <div>
        <p className="font-bold dark:text-white">
          💸 ${delta / 1000000} {reference}!
        </p>
        <p className="text-xs mb-1 text-zinc-400">
          {format(new Date(date), 'H:mm:ss iiii do MMMM yyyy')}
        </p>
      </div>
      {meta && meta.receipt_url && (
        <button
          className="btn inline-flex items-center"
          onClick={() => window.open(meta.receipt_url, '_blank')}>
          <DocumentDownloadIcon className="w-6" />
        </button>
      )}
    </div>
  )
}
