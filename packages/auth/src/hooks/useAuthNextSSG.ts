import { useRouter } from 'next/router'
import { useEffect } from 'react'
import type { AuthContext } from '../components/AuthProvider'
import { useAuthContext } from '../components/AuthProvider'

interface UseAuthNextSSGProps {
  redirectTo?: string
}

export function useAuthNextSSG({
  redirectTo = '/'
}: UseAuthNextSSGProps): AuthContext {
  const context = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!context.isAuthenticating && context.user) {
      router.push(redirectTo)
    }
  }, [context])

  return context
}
