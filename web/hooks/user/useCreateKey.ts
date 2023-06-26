import { useMutation, useQueryClient } from 'react-query'
import { useM3OApi } from '@/hooks'

interface CreateKeyResponse {
  api_key: string
  api_key_id: string
}

interface CreateKeyPayload {
  description: string
  scopes: string[]
}

export function useCreateKey() {
  const m3oApi = useM3OApi()
  const queryClient = useQueryClient()

  return useMutation(
    async (payload: CreateKeyPayload) => {
      const response = await m3oApi.post<CreateKeyResponse>(
        '/v1/api/keys/generate',
        {
          ...payload,
          scopes: payload.scopes.length ? payload.scopes : ['*'],
        },
      )

      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('api-keys')
      },
    },
  )
}
