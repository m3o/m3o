import { useQuery } from 'react-query'
import { useM3OClient } from '..'
import { QueryKeys } from '@/lib/constants'

export function useFetchUsers() {
  const m3o = useM3OClient()

  return useQuery(QueryKeys.CloudUsers, async () => {
    const response = await m3o.user.list({})
    return response.users || []
  })
}
