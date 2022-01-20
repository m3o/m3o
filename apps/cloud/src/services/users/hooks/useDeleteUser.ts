import { useUserInstance } from './useUsersInstance'
import { useMutation, useQueryClient } from 'react-query'

interface UseDeleteUserProps {
  onSuccess: VoidFunction
}

export function useDeleteUser({ onSuccess }: UseDeleteUserProps) {
  const queryClient = useQueryClient()
  const user = useUserInstance()

  return useMutation(
    (id: string) => {
      return user.delete({ id })
    },
    {
      onSuccess: () => {
        onSuccess()
        queryClient.invalidateQueries('users')
      }
    }
  )
}
