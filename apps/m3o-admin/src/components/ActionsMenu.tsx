import type { FC } from 'react'
import { DotsVerticalIcon } from '@heroicons/react/outline'

interface Props {
  onButtonClick: VoidFunction
  isOpen: boolean
  onDeleteClick: VoidFunction
}

export const ActionsMenu: FC<Props> = ({
  onButtonClick,
  isOpen,
  onDeleteClick
}) => {
  return (
    <div className="relative">
      <button
        onClick={onButtonClick}
        className="hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
      >
        <DotsVerticalIcon className="w-5" />
      </button>
      {isOpen && (
        <div className="absolute">
          <button onClick={onDeleteClick}>Delete</button>
        </div>
      )}
    </div>
  )
}
