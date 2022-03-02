import type { ListResponse } from 'm3o/user'
import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api-client'
import { QueryKeys } from '@/lib/constants'

export function useFetchUsers() {
  return useQuery(
    QueryKeys.CloudUsers,
    async () => {
      const response = await apiClient.post<ListResponse>('user/List')
      return response.data.users || []
    },
    {
      initialData: [],
    },
  )
}
