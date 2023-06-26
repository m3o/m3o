import type { FC } from 'react'
import type { FormattedUsage } from '@/types'
import classNames from 'classnames'
import { useState } from 'react'
import { useGetUsage } from '@/hooks'
import { Spinner } from '@/components/ui'
import {
  returnUsageForThisMonth,
  returnUsageForLastMonth,
  returnUsageForLast30Days,
} from '@/utils/usage'
import { TimeSelections } from './Usage.constants'
import { LineGraph } from './LineGraph'

interface Props {
  showAllResults?: boolean
}

const DATA_FORMATTERS: Record<
  TimeSelections,
  (data: FormattedUsage) => FormattedUsage
> = {
  [TimeSelections.LastMonth]: returnUsageForLastMonth,
  [TimeSelections.ThisMonth]: returnUsageForThisMonth,
  [TimeSelections.Past30Days]: returnUsageForLast30Days,
}

export const Usage: FC<Props> = ({ showAllResults = false }) => {
  const [timeSelection, setTimeSelection] = useState(TimeSelections.ThisMonth)
  const { data = [], isLoading } = useGetUsage()
  const formattedData = DATA_FORMATTERS[timeSelection](data)

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="mt-8 tbgc rounded-lg pt-10 pb-16">
      <div className="px-10">
        <h5 className="font-bold text-xl text-black dark:text-white mb-2">
          Historic Usage
        </h5>
        {Object.values(TimeSelections).map(value => (
          <button
            onClick={() => setTimeSelection(value)}
            key={value}
            className={classNames('px-4 py-2 text-sm', {
              'bg-zinc-700 rounded-lg font-bold text-white':
                timeSelection === value,
            })}>
            {value}
          </button>
        ))}
      </div>
      <LineGraph usage={formattedData} currentTimeSelection={timeSelection} />
    </div>
  )
}
