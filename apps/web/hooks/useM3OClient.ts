import { useCookies } from 'react-cookie'
import { useRef } from 'react'
import { AuthCookieNames } from '@/lib/constants'
import { createApiClient } from './api-client'

export function useM3OClient() {
  const [cookies] = useCookies()
  const m3o = useRef(createApiClient(cookies[AuthCookieNames.ApiToken]))
  return m3o.current
}
