import { m3oInstance } from '@/lib/api/m3o/api'
import { useCookies } from 'react-cookie'
import { AuthCookieNames } from '@/lib/constants'
import { useEffect } from 'react'

export function useM3OApi() {
  const [cookies] = useCookies()

  useEffect(() => {
    const token = cookies[AuthCookieNames.Token]

    if (token) {
      m3oInstance.interceptors.request.use(config => {
        config.headers['micro-namespace'] = 'micro'
        config.headers['authorization'] = `Bearer ${token}`
        return config
      })
    }
  }, [cookies])

  return m3oInstance
}
