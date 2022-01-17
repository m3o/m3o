import type { Account } from 'm3o/user'
import { useMutation, useQueryClient } from 'react-query'
import { useUserInstance } from './useUsersInstance'

interface UseDeleteMultipleUsers {
  onSuccess: VoidFunction
}

export function useDeleteMultipleUsers({ onSuccess }: UseDeleteMultipleUsers) {
  const queryClient = useQueryClient()
  const user = useUserInstance()

  return useMutation(
    (items: Required<Account>[]) =>
      Promise.all(items.map((item) => user.delete({ id: item.id }))),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        onSuccess()
      }
    }
  )
}
