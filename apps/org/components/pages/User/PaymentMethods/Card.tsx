import type { FC } from 'react'
import { TrashIcon } from '@heroicons/react/solid'

interface CardProps extends Card {
  onDeleteClick: VoidFunction
}

export const Card: FC<CardProps> = ({ last_four, expires, onDeleteClick }) => {
  return (
    <div className="bg-zinc-600 inline-block text-white py-16 px-10 rounded-md relative overflow-hidden mr-4">
      <h4 className="font-mono text-sm">**** **** **** {last_four}</h4>
      <p className="text-xs absolute bottom-4 left-6">{expires}</p>
      <div className="inset-0 absolute bg-zinc-600 bg-opacity-90 opacity-0 hover:opacity-100 transition flex">
        <button
          className="m-auto border cursor-pointer p-2 rounded-full"
          onClick={onDeleteClick}>
          <TrashIcon className="w-4" />
        </button>
      </div>
    </div>
  )
}
