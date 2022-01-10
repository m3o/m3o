import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useDbInstance } from './useDbInstance'

export function useDbDropTable() {
  const navigate = useNavigate()
  const db = useDbInstance()
  const queryClient = useQueryClient()

  return useMutation((table: string) => db.dropTable({ table }), {
    onSuccess: () => {
      queryClient.invalidateQueries('db-tables')
      navigate('/database')
    }
  })
}
