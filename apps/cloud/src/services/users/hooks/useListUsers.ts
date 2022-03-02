import { useUserInstance } from './useUsersInstance'
import { useQuery } from 'react-query'

export function useListUsers() {
  const user = useUserInstance()

  return useQuery(
    'users',
    async () => {
      const response = await user.list({})
      return (response.users || []).reverse()
    },
    {
      refetchOnWindowFocus: false
    }
  )
}
