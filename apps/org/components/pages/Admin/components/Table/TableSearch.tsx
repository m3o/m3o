import type { FC, ChangeEventHandler } from 'react'
import { SearchIcon } from '@heroicons/react/outline'

interface Props {
  tableName: string
  onChange: ChangeEventHandler
}

export const TableSearch: FC<Props> = ({ tableName, onChange }) => {
  return (
    <div className="relative dark:text-white w-full md:w-auto px-6">
      <SearchIcon className="w-4 absolute left-10 top-1/2 -translate-y-1/2 transform" />
      <input
        type="text"
        className="text-sm outline-none bg-zinc-100 dark:bg-zinc-700 rounded-md box-border w-full pl-12 py-4 md:w-72"
        placeholder={`Search ${tableName}...`}
        onChange={onChange}
      />
    </div>
  )
}
