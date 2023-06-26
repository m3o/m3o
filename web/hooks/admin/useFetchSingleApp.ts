import type { Service } from 'm3o/app'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '..'

export function useFetchSingleApp(initialState: Service) {
  const router = useRouter()
  const m3o = useM3OClient()
  const name = router.query.name as string

  return useQuery(
    [QueryKeys.CloudApps, name],
    async () => {
      const response = await m3o.app.status({ name })
      return response.service
    },
    {
      initialData: initialState,
    },
  )
}
