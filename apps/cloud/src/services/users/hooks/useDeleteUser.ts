import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { m3oClient } from '../../../lib/m3o-client'

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation((id: string) => m3oClient.post('user/delete', { id }), {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      navigate('/users')
    }
  })
}
