import type { DbService } from 'm3o/db'
import { useQuery } from 'react-query'
import { useDbInstance } from './useDbInstance'

interface ExpectedRecord {
  id: string
  [key: string]: any
}

export async function returnTableRecords(
  db: DbService,
  tableName: string
): Promise<ExpectedRecord[]> {
  const response = await db.read({ table: tableName })
  return (response.records as ExpectedRecord[]) || []
}

export function useFetchTableData(tableName: string) {
  const db = useDbInstance()

  return useQuery(`db-table-${tableName}`, () =>
    returnTableRecords(db, tableName)
  )
}
