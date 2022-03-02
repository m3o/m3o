import { useMutation, useQueryClient } from 'react-query'
import { useUserInstance } from './useUsersInstance'

export function useDeleteMultipleUsers() {
  const queryClient = useQueryClient()
  const user = useUserInstance()

  return useMutation(
    (items: string[]) =>
      Promise.all(items.map((item) => user.delete({ id: item }))),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    }
  )
}
