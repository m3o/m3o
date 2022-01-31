import { useMutation, useQueryClient } from 'react-query'
import { db } from '../db.service'

type SetOpenRowDataId = (id: string) => void

export function useDeleteTableRow(
  tableName: string,
  setOpenRowDataId: SetOpenRowDataId
) {
  const queryClient = useQueryClient()

  return useMutation((id: string) => db.delete({ table: tableName, id }), {
    onSuccess: () => {
      setOpenRowDataId('')
      queryClient.invalidateQueries(`db-table-${tableName}`)
    }
  })
}
