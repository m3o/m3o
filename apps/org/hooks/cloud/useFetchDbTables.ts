import { useQuery } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '..'

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
  const m3o = useM3OClient()

  return useQuery(
    QueryKeys.CloudDatabaseTables,
    async () => {
      const response = await m3o.db.listTables({})

      return (response.tables || []).filter(
        item => !SECRET_TABLE_NAMES.includes(item),
      )
    },
    {
      initialData: [],
    },
  )
}
