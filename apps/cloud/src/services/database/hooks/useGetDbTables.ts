import { useQuery } from 'react-query'
import { db } from '../db.service'

const SECRET_TABLE_NAMES = [
  'default',
  'apivisit',
  'apicalls',
  'passwords',
  'sessions',
  'password_reset_codes',
  'users'
]

export async function fetchTables() {
  const { tables = [] } = await db.listTables({})
  return tables.filter((item) => !SECRET_TABLE_NAMES.includes(item))
}

export function useGetDbTables() {
  return useQuery('db-tables', fetchTables)
}
