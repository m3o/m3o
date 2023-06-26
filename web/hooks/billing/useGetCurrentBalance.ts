import { useQuery } from 'react-query'
import { useUser } from '@/providers'
import { QueryKeys } from '@/lib/constants'
import { useM3OApi } from '../m3o/useM3OApi'

interface CurrentBalanceResponse {
  current_balance?: number
}

export function useGetCurrentBalance() {
  const m3oApi = useM3OApi()
  const user = useUser()

  return useQuery(QueryKeys.CurrentBalance, async () => {
    const {
      data: { current_balance = 0 },
    } = await m3oApi.post<CurrentBalanceResponse>('/balance/Current', {
      customer_id: user!.id,
    })

    return current_balance / 1000000
  })
}
