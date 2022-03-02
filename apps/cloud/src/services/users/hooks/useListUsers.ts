import type { ListResponse } from 'm3o/user'
import { useQuery } from 'react-query'
import { m3oClient } from '../../../lib/m3o-client'

export function useListUsers() {
  return useQuery(
    'users',
    async () => {
      const response = await m3oClient.post<ListResponse>('user/list')
      return (response.data.users || []).reverse()
    },
    {
      refetchOnWindowFocus: false,
      initialData: []
    }
  )
}
