import type { ReactElement } from 'react'
import type { FormattedUsageRecord } from '@/types'
import { Fragment } from 'react'
import isSameDay from 'date-fns/isSameDay'
import format from 'date-fns/format'
import { returnDatesForXPositions } from './Usage.utils'
import { TimeSelections } from './Usage.constants'

interface Props {
  currentTimeSelection: TimeSelections
  records: FormattedUsageRecord[]
}

export function Graph({ currentTimeSelection, records }: Props): ReactElement {
  const dates = returnDatesForXPositions(currentTimeSelection)
  const maxRequestsValue = Math.max(...records.map(item => item.requests))

  return (
    <>
      {dates.map(date => (
        <div
          key={date.getTime()}
          className="flex-1 border-r border-zinc-800 flex relative h-full">
          <div className="absolute bottom-4 w-full text-center text-xs">
            {format(date, 'dd')}
          </div>
          {records.map(item => {
            const display = isSameDay(item.date, date)
            const height = item.requests
              ? `${(item.requests / maxRequestsValue) * 100}%`
              : 0

            return display ? (
              <div
                className="w-full mt-auto bg-pink-600 hover:bg-pink-700 cursor-pointer"
                style={{ height }}></div>
            ) : null
          })}
        </div>
      ))}
    </>
  )
}
