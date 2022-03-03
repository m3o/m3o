import type { ReadResponse } from 'm3o/db'
import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api-client'
import { QueryKeys } from '@/lib/constants'

export function useFetchDbTableData(name: string) {
  return useQuery(
    [QueryKeys.CloudDatabaseTables, name],
    async () => {
      const response = await apiClient.post<ReadResponse>('db/Read', {
        table: name,
        limit: 1000,
      })
      return response.data.records || []
    },
    {
      initialData: [],
    },
  )
}
