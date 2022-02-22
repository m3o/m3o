import { useCallback } from 'react'
import addDays from 'date-fns/addDays'
import { useCookies } from 'react-cookie'
import { AuthCookieNames } from '@/lib/constants'

export function useSetAuthTokens() {
  const [, setCookie] = useCookies()

  return useCallback(
    (token: Token) => {
      const expires = addDays(new Date(), 30)
      const opts = {
        path: '/',
        expires,
      }

      setCookie(AuthCookieNames.Token, token.access_token, opts)
      setCookie(AuthCookieNames.Refresh, token.refresh_token, opts)
      setCookie(AuthCookieNames.Expiry, token.expiry, opts)
      setCookie(
        AuthCookieNames.Namespace,
        process.env.NEXT_PUBLIC_NAMESPACE,
        opts,
      )
    },
    [setCookie],
  )
}
