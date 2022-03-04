import { useMutation, useQueryClient } from 'react-query'
import { apiClient } from '@/lib/api-client'

export function useUpdateApp() {
  const queryClient = useQueryClient()

  return useMutation(
    (name: string) => apiClient.post('/app/Update', { name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('apps')
      },
    },
  )
}
