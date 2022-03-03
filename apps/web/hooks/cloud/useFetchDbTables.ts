import type { ListTablesResponse } from 'm3o/db'
import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api-client'
import { QueryKeys } from '@/lib/constants'

const SECRET_TABLE_NAMES = [
  'default',
  'apivisit',
  'apicalls',
  'passwords',
  'sessions',
  'password_reset_codes',
  'users',
]

export function useFetchDbTables() {
  return useQuery(
    QueryKeys.CloudDatabaseTables,
    async () => {
      const response = await apiClient.post<ListTablesResponse>('db/ListTables')
      return (response.data.tables || []).filter(
        item => !SECRET_TABLE_NAMES.includes(item),
      )
    },
    {
      initialData: [],
    },
  )
}
