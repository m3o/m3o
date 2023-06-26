import { useQuery } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OApi } from '../m3o/useM3OApi'

interface APIKeyEntry {
  id: string
  description: string
  created_time: number
  scopes: string[]
  last_seen: number
}

interface ListKeysResponse {
  api_keys?: APIKeyEntry[]
}

export function useListKeys() {
  const m3oApi = useM3OApi()

  return useQuery(QueryKeys.ApiKey, async () => {
    const response = await m3oApi.post<ListKeysResponse>(
      '/v1/api/keys/list',
      {},
    )

    if (!response.data.api_keys) {
      return [] as APIKey[]
    }

    return response.data.api_keys.reduce((arr, apiKey) => {
      return [
        ...arr,
        {
          description: apiKey.description,
          id: apiKey.id,
          createdTime: apiKey.created_time,
          scopes: apiKey.scopes,
          lastSeen: apiKey.last_seen,
        } as APIKey,
      ]
    }, [] as APIKey[])
  })
}
