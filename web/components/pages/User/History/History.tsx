import type { FC } from 'react'
import type { Adjustment } from '@/types'
import PulseLoader from 'react-spinners/PulseLoader'
import { useGetHistory } from '@/hooks'
import { HistoryItem } from './HistoryItem'

function renderHistoryItems(isLoading: boolean, historyItems: Adjustment[]) {
  if (isLoading) {
    return <PulseLoader size={5} />
  }

  if (historyItems.length === 0) {
    return <div>No results</div>
  }

  return historyItems.map(item => <HistoryItem key={item.id} {...item} />)
}

export const History: FC = () => {
  const { history, isLoading } = useGetHistory()

  return (
    <div className="mt-8 tbgc p-6 md:p-10 rounded-lg">
      <h3 className="font-bold text-2xl text-black mb-1 dark:text-white">
        History
      </h3>
      {renderHistoryItems(isLoading, history)}
    </div>
  )
}
