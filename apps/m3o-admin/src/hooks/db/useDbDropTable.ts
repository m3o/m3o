import { useMutation, useQueryClient } from 'react-query'
import { useDbInstance } from './useDbInstance'

export function useDbDropTable() {
  const db = useDbInstance()
  const queryClient = useQueryClient()

  return useMutation((table: string) => db.dropTable({ table }), {
    onSuccess: () => {
      queryClient.invalidateQueries('db-tables')
    }
  })
}
