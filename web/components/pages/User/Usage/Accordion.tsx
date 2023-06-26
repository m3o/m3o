import type { FC } from 'react'
import type { FormattedUsage } from '@/types'
import { ChevronDownIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { useState } from 'react'
import { Graph } from './Graph'
import { TimeSelections } from './Usage.constants'

interface Props {
  usage: FormattedUsage
  currentTimeSelection: TimeSelections
}

export const Accordion: FC<Props> = ({ usage, currentTimeSelection }) => {
  const [openRow, setOpenRow] = useState('')

  const toggleAccordionRow = (name: string) => {
    setOpenRow(prev => (prev === name ? '' : name))
  }
  return (
    <div className="border-t mt-10 tbc">
      {usage.map(item => {
        return (
          <div key={item.name}>
            <button
              onClick={() => toggleAccordionRow(item.name)}
              className="px-10 py-6 hover:bg-zinc-600 w-full text-left flex items-center justify-between">
              <p className="text-sm">{item.name}</p>
              <p>
                {item.records.reduce((num, item) => item.requests + num, 0)}
              </p>
              <ChevronDownIcon
                className={classNames('w-6', {
                  'rotate-180': item.name === openRow,
                })}
              />
            </button>
            {openRow === item.name && (
              <div className="h-96 flex p-6 bg-zinc-900">
                <Graph
                  currentTimeSelection={currentTimeSelection}
                  records={item.records}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
