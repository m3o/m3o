import { useQuery } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '..'

export function useFetchDbTableData(name: string) {
  const m3o = useM3OClient()

  return useQuery(
    [QueryKeys.CloudDatabaseTables, name],
    async () => {
      const response = await m3o.db.read({ table: name, limit: 1000 })
      return response.records || []
    },
    {
      initialData: [],
    },
  )
}
