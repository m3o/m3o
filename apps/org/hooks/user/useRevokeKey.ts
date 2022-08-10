import { useMutation, useQueryClient } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OApi } from '@/hooks'

interface UseRevokeKeys {
  onSuccess?: VoidFunction
}

export function useRevokeKey({ onSuccess }: UseRevokeKeys) {
  const queryClient = useQueryClient()
  const m3oApi = useM3OApi()

  return useMutation(
    (keyId: string) => m3oApi.post('/v1/api/keys/revoke', { id: keyId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.ApiKey)

        if (onSuccess) {
          onSuccess()
        }
      },
    },
  )
}
