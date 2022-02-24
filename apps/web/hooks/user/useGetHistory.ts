import type { Adjustment } from '@/types'
import { useQuery } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OApi } from '../m3o/useM3OApi'

interface ListAdjustmentsResponse {
  adjustments?: Adjustment[]
}

export function useGetHistory() {
  const m3oApi = useM3OApi()

  const { data: history = [], isLoading } = useQuery(
    QueryKeys.History,
    async () => {
      const response = await m3oApi.post<ListAdjustmentsResponse>(
        '/balance/ListAdjustments',
      )

      return (response.data.adjustments || []).reverse()
    },
  )

  return {
    history,
    isLoading,
  }
}
