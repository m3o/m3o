import type { DbService } from 'm3o/db'
import { useQuery } from 'react-query'
import { useDbInstance } from './useDbInstance'

const SECRET_TABLE_NAMES = [
  'default',
  'apivisit',
  'apicalls',
  'passwords',
  'sessions',
  'password_reset_codes',
  'users'
]

export async function fetchTables(db: DbService) {
  const { tables = [] } = await db.listTables({})
  return tables.filter((item) => !SECRET_TABLE_NAMES.includes(item))
}

export function useGetDbTables() {
  const db = useDbInstance()
  return useQuery('db-tables', () => fetchTables(db))
}
