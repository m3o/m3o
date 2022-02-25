import type { FC } from 'react'
import { DotsVerticalIcon } from '@heroicons/react/outline'
import { useClickOutside } from '../../../hooks/useClickOutside'

interface Props {
  handleClose: VoidFunction
  handleButtonClick: VoidFunction
  handleDeleteClick: VoidFunction
  handleUpdateClick: VoidFunction
  isOpen: boolean
}

export const FunctionMenu: FC<Props> = ({
  handleButtonClick,
  handleClose,
  handleDeleteClick,
  handleUpdateClick,
  isOpen
}) => {
  const clickOutsideRef = useClickOutside({
    onClickOutside: handleClose,
    trigger: isOpen
  })

  return (
    <div className="relative">
      <button className="text-zinc-300" onClick={handleButtonClick}>
        <DotsVerticalIcon className="w-6" />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 w-40 bg-zinc-800 border border-zinc-600 rounded-md overflow-hidden"
          ref={clickOutsideRef}
        >
          <button
            className="w-full text-left px-4 py-2 border-b border-zinc-600 hover:bg-zinc-700"
            onClick={handleUpdateClick}
          >
            Update
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-zinc-700"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
