import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { returnLoginUrl } from '../utils/auth'
import { MICRO_API_TOKEN_COOKIE_NAME } from '../constants'

export function useRedirectToLogin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [cookies] = useCookies()

  useEffect(() => {
    if (!cookies[MICRO_API_TOKEN_COOKIE_NAME]) {
      window.location.href = returnLoginUrl()
    } else {
      setAuthenticated(true)
    }
  }, [cookies])

  return { authenticated }
}
