import type { Service } from 'm3o/app'
import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api-client'
import { QueryKeys } from '@/lib/constants'

export function useFetchSingleApp(name: string) {
  return useQuery(
    [QueryKeys.CloudApps, name],
    async () => {
      const response = await apiClient.post<{ service: Service }>(
        'app/Status',
        {
          name,
        },
      )

      return response.data.service
    },
    {
      refetchInterval: 5000,
    },
  )
}
