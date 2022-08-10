import { useCookies } from 'react-cookie'
import { useRef } from 'react'
import { createApiClient } from '@/lib/api-client'
import { AuthCookieNames } from '@/lib/constants'

export function useM3OClient() {
  const [cookies] = useCookies()
  const m3o = useRef(createApiClient(cookies[AuthCookieNames.ApiToken]))
  return m3o.current
}
