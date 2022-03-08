import { useQuery } from 'react-query'
import { useM3OClient } from '..'
import { QueryKeys } from '@/lib/constants'

export function useFetchApps() {
  const m3o = useM3OClient()

  return useQuery(
    QueryKeys.CloudApps,
    async () => {
      const response = await m3o.app.list({})
      console.log(response)
      return response.services || []
    },
    {
      initialData: [],
      refetchInterval: 5000,
    },
  )
}
