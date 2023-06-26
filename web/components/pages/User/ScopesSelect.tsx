import type { FC } from 'react'
import { useState } from 'react'
import classnames from 'classnames'
import ChevronDownIcon from '@heroicons/react/outline/ChevronDownIcon'
import { useClickOutside } from '@/hooks'

export interface Props {
  options: string[]
  selectedOptions: string[]
  onScopeSelect: (scope: string) => void
}

export const ScopesSelect: FC<Props> = ({
  options,
  selectedOptions,
  onScopeSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const clickOutsideRef = useClickOutside({
    trigger: isOpen,
    onClickOutside: () => setIsOpen(false),
  })

  return (
    <div className="relative">
      <p className="font-medium">Scopes</p>
      <p className="font-light text-zinc-600 my-4 text-sm dark:text-zinc-400">
        Select scopes to restrict key or leave blank to allow access to all
        available APIs
      </p>
      <div>
        <button
          className="w-full text-left flex justify-between border border-zinc-300 p-4 rounded-md items-center mt-2 dark:border-zinc-600"
          onClick={() => setIsOpen(!isOpen)}>
          {selectedOptions.length ? (
            <span className="text-sm">{selectedOptions.join(', ')}</span>
          ) : (
            <span className="text-sm text-zinc-300">No scopes selected</span>
          )}
          <ChevronDownIcon className="w-4" />
        </button>
      </div>
      {isOpen && (
        <div
          className="max-h-80 overflow-y-scroll border border-zinc-300 absolute bg-white w-full dark:bg-zinc-800 rounded-md dark:border-zinc-600"
          ref={clickOutsideRef}>
          {options.map(option => (
            <button
              key={option}
              className={classnames(
                'rounded-md text-left hover:bg-zinc-100 block w-full text-sm border border-transparent p-4 dark:hover:bg-zinc-700',
                {
                  'border-indigo-600 bg-indigo-50 font-bold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:bg-zinc-700':
                    selectedOptions.includes(option),
                },
              )}
              onClick={() => onScopeSelect(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
