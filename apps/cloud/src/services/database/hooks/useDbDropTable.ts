import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { db } from '../db.service'

export function useDbDropTable() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation((table: string) => db.dropTable({ table }), {
    onSuccess: () => {
      queryClient.invalidateQueries('db-tables')
      navigate('/database')
    }
  })
}
