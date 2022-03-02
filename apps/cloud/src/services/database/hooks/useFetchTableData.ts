import { useQuery } from 'react-query'
import { db } from '../db.service'

interface ExpectedRecord {
  id: string
  [key: string]: any
}

export async function returnTableRecords(
  tableName: string
): Promise<ExpectedRecord[]> {
  const response = await db.read({ table: tableName, limit: 1000 })
  return (response.records as ExpectedRecord[]) || []
}

export function useFetchTableData(tableName: string) {
  return useQuery(['db-table', tableName], () => returnTableRecords(tableName))
}
