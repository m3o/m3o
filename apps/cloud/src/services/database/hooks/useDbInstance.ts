import { useCookies } from 'react-cookie'
import { DbService } from 'm3o/db'

export function useDbInstance() {
  const [cookies] = useCookies()
  return new DbService(cookies['micro_api_token'])
}
