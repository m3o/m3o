import { useMutation, useQueryClient } from 'react-query'
import { useDbInstance } from './useDbInstance'

type SetOpenRowDataId = (id: string) => void

export function useDeleteTableRow(
  tableName: string,
  setOpenRowDataId: SetOpenRowDataId
) {
  const queryClient = useQueryClient()
  const db = useDbInstance()

  return useMutation((id: string) => db.delete({ table: tableName, id }), {
    onSuccess: () => {
      setOpenRowDataId('')
      queryClient.invalidateQueries(`db-table-${tableName}`)
    }
  })
}
