import type { FC, FormEventHandler } from 'react'
import SearchIcon from '@heroicons/react/outline/SearchIcon'

interface Props {
  initialSearchTerm: string
  handleSubmit: FormEventHandler
}

export const ExploreSearch: FC<Props> = ({
  initialSearchTerm,
  handleSubmit,
}) => {
  return (
    <form className="w-full overflow-hidden relative" onSubmit={handleSubmit}>
      <SearchIcon className="w-6 absolute top-1/2 -translate-y-1/2 transform left-4" />
      <input
        type="text"
        className="p-4 placeholder-zinc-400 pl-16 bg-white dark:bg-zinc-800 w-full rounded-md appearance-none text-sm"
        placeholder="Search for APIs"
        autoFocus={true}
        defaultValue={initialSearchTerm}
        name="search"
      />
    </form>
  )
}
