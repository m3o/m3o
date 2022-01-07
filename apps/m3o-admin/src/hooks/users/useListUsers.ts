import { useUserInstance } from './useUsersInstance'
import { useQuery } from 'react-query'

export function useListUsers() {
  const user = useUserInstance()
}
