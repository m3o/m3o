import { useCookies } from 'react-cookie'
import { AuthCookieNames } from '@/lib/constants'

export function useV1Token(): string | undefined {
  const [cookies] = useCookies()
  return cookies[AuthCookieNames.ApiToken]
}
