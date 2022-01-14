import { useMutation } from 'react-query'
import type { Account } from 'm3o/user'
import { useUserInstance } from './useUsersInstance'

export function useDeleteMultipleUsers() {
  const user = useUserInstance()

  return useMutation(
    (items: Required<Account>[]) =>
      Promise.all(items.map((item) => user.delete({ id: item.id }))),
    {
      onSuccess: () => {
        alert('Success')
      }
    }
  )
}
