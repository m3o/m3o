import type { FC, ChangeEventHandler } from 'react'
import SearchIcon from '@heroicons/react/outline/SearchIcon'

interface Props {
  handleChange: ChangeEventHandler<HTMLInputElement>
  value: string
}

export const ExploreSearch: FC<Props> = ({ handleChange, value }) => {
  return (
    <div className="w-full overflow-hidden relative">
      <SearchIcon className="w-6 absolute top-1/2 -translate-y-1/2 transform left-4" />
      <input
        type="text"
        className="p-4 placeholder-zinc-400 pl-16 bg-white dark:bg-zinc-800 w-full rounded-md appearance-none"
        placeholder="Search for APIs"
        onChange={handleChange}
        autoFocus={true}
        value={value}
      />
    </div>
  )
}
