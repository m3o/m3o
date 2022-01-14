import type { FC, ChangeEventHandler } from 'react'
import { SearchIcon } from '@heroicons/react/outline'

interface Props {
  tableName: string
  onChange: ChangeEventHandler
}

export const TableSearch: FC<Props> = ({ tableName, onChange }) => {
  return (
    <div className="relative text-white  rounded-md">
      <SearchIcon className="w-4 absolute left-5 top-1/2 -translate-y-1/2 transform" />
      <input
        type="text"
        className="pl-10 text-sm m-2 bg-transparent h-12 p-5 outline-none bg-gray-700 rounded-md"
        placeholder={`Search ${tableName}...`}
        onChange={onChange}
      />
    </div>
  )
}
