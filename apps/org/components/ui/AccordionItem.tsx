import type { PropsWithChildren, ReactElement } from 'react'
import classNames from 'classnames'
import { ChevronDownIcon } from '@heroicons/react/outline'

type Props = {
  isOpen?: boolean
  title: string
  onClick: VoidFunction
}

export function AccordionItem({
  children,
  title,
  isOpen = false,
  onClick,
}: PropsWithChildren<Props>): ReactElement {
  return (
    <div className="border-b border-zinc-800 overflow-hidden max-w-2xl m-auto">
      <button
        className="text-left flex w-full justify-between items-center py-8 font-bold"
        onClick={onClick}>
        {title}
        <ChevronDownIcon
          className={classNames('w-6 transition-transform duration-500', {
            ['rotate-180']: isOpen,
          })}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-sm text-zinc-400">{children}</div>
      )}
    </div>
  )
}
