import { useCookies } from 'react-cookie'
import { UserService } from 'm3o/user'

export function useUserInstance() {
  const [cookies] = useCookies()
  return new UserService(cookies['micro_api_token'])
}
