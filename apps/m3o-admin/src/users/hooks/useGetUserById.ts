import { useUserInstance } from './useUsersInstance'
import { useQuery } from 'react-query'

export function useGetUserById(id: string) {
  const user = useUserInstance()

  return useQuery(`user-${id}`, async () => {
    const response = await user.read({ id })
    return response.account
  })
}
