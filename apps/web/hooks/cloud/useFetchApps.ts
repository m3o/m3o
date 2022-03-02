import type { ListResponse } from 'm3o/app'
import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api-client'
import { QueryKeys } from '@/lib/constants'

export function useFetchApps() {
  return useQuery(
    QueryKeys.CloudApps,
    async () => {
      const response = await apiClient.post<ListResponse>('/app/List')
      return response.data.services || []
    },
    {
      initialData: [],
      refetchInterval: 5000,
    },
  )
}
