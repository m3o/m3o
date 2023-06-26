import type { Usage } from '@/types'
import { useQuery } from 'react-query'
import { useUser } from '@/providers'
import { useM3OApi } from '../m3o/useM3OApi'

interface ListResponse {
  quota_remaining: string
  usage: Usage
}

export function useLegacyUsage() {
  const user = useUser()
  const m3oApi = useM3OApi()

  return useQuery('legacy-usage', async (): Promise<ListResponse> => {
    const response = await m3oApi.post<ListResponse>('/usage/Read', {
      userId: user!.id,
    })

    return response.data
  })
}
