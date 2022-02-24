import type { Usage } from '@/types'
import { useQuery } from 'react-query'
import { useUser } from '@/providers'
import { useM3OApi } from '../m3o/useM3OApi'
import { formatUsageItems } from '@/utils/usage'

interface ListResponse {
  usage: Usage
}

export function useGetUsage() {
  const user = useUser()
  const m3oApi = useM3OApi()

  return useQuery('usage', async () => {
    const response = await m3oApi.post<ListResponse>('/usage/Read', {
      userId: user!.id,
    })

    return formatUsageItems(response.data.usage)
  })
}
