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
  showingResults
}) => {
  return (
    <div className="border-b border-gray-700 p-1 flex justify-between items-center">
      <div>
        {hasCheckedItems && (
          <div className="ml-4">
            <button className="circle-btn" onClick={onDeleteClick}>
              <TrashIcon className="w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <p className="text-sm mr-4 border-r border-zinc-700 pr-4">
          {showingResults}
        </p>
        <div className="text-right mr-2 flex items-center">
          <p className="text-xs mr-2">Page size:</p>
          <select
            className="bg-zinc-700 p-2 rounded-md text-sm"
            onChange={onPageSizeChange}
            value={pageSize}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        {right}
      </div>
    </div>
  )
}
