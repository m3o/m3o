import type { FC, ReactNode, ChangeEventHandler } from 'react'
import { TrashIcon } from '@heroicons/react/outline'

interface Props {
  hasCheckedItems: boolean
  right: ReactNode
  onPageSizeChange: ChangeEventHandler<HTMLSelectElement>
  onDeleteClick: VoidFunction
  pageSize: number
  showingResults: string
}

export const ActionsBar: FC<Props> = ({
  hasCheckedItems,
  right,
  onDeleteClick,
  onPageSizeChange,
  pageSize,
  showingResults,
}) => {
  return (
    <div className="border-b tbc py-4">
      <div className="md:flex md:items-center">
        <div className="flex items-center justify-between py-4 pt-0 px-6 ml-auto md:pb-0 md:pr-0">
          <p className="text-sm mr-4 md:border-r md:border-zinc-700 pr-4">
            {showingResults}
          </p>
          <div className="text-right flex items-center">
            <p className="text-xs mr-2">Page size:</p>
            <select
              className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded-md text-sm"
              onChange={onPageSizeChange}
              value={pageSize}>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
        {right}
      </div>
      {hasCheckedItems && (
        <div className="border-t tbc mt-4">
          <button
            className="bg-red-200 text-sm flex items-center mt-4 ml-6 py-2 px-4 rounded-md tbgc"
            onClick={onDeleteClick}>
            <TrashIcon className="w-4 mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  )
}
