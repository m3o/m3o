import { useCookies } from 'react-cookie'
import { AppService } from 'm3o/app'

export function useAppsInstance() {
  const [cookies] = useCookies()
  return new AppService(cookies['micro_api_token'])
}
