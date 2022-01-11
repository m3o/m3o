import type { FC, ChangeEventHandler } from 'react'
import { SearchIcon } from '@heroicons/react/outline'

interface Props {
  tableName: string
  onChange: ChangeEventHandler
}

export const TableSearch: FC<Props> = ({ tableName, onChange }) => {
  return (
    <div className="relative pl-2 border-b border-gray-700 bg-gray-900 text-white">
      <SearchIcon className="w-4 absolute left-4 top-1/2 -translate-y-1/2 transform" />
      <input
        type="text"
        className="p-4 pl-8 text-sm m-2 box-border bg-transparent"
        placeholder={`Search ${tableName}...`}
        onChange={onChange}
      />
    </div>
  )
}
