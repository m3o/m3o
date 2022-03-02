import { useMutation, useQueryClient } from 'react-query'
import { m3oClient } from '../../../lib/m3o-client'

export function useDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation(
    (items: string[]) =>
      Promise.all(
        items.map((item) => m3oClient.post('user/delete', { id: item }))
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    }
  )
}
