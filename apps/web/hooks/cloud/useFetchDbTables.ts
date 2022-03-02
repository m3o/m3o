import type { ListTablesResponse } from 'm3o/db'
import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api-client'
import { QueryKeys } from '@/lib/constants'

export function useFetchDbTables() {
  return useQuery(
    QueryKeys.CloudDatabaseTables,
    async () => {
      const response = await apiClient.post<ListTablesResponse>('db/ListTables')
      return response.data.tables || []
    },
    {
      initialData: [],
    },
  )
}
