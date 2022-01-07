import { useMutation, useQueryClient } from 'react-query'
import { useDbInstance } from './useDbInstance'

export function useDeleteTableRow(tableName: string) {
  const queryClient = useQueryClient()
  const db = useDbInstance()

  return useMutation((id: string) => db.delete({ table: tableName, id }), {
    onSuccess: () => {
      queryClient.invalidateQueries(`db-table-${tableName}`)
    }
  })
}
