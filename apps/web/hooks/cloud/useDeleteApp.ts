import { useMutation, useQueryClient } from 'react-query'
import { apiClient } from '@/lib/api-client'

export function useDeleteApp() {
  const queryClient = useQueryClient()

  return useMutation(
    (name: string) => apiClient.post('/app/Delete', { name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('apps')
      },
    },
  )
}
