import type { FC } from 'react'

interface Props {
  onClick: VoidFunction
}

export const ClearAllButton: FC<Props> = ({ onClick }) => {
  return (
    <button
      className="mb-4 border border-zinc-600 py-1 px-2 text-zinc-600 text-sm rounded-md"
      onClick={onClick}
      data-test="explore-clear-all-button">
      Clear all
    </button>
  )
}
