import type { ApiHookProps, ApiError } from '@m3o/types'
import { useCallback } from 'react'
import { post, useApiState } from '@m3o/ui'
import { useAuthContext } from '../components/AuthProvider'
import { CONFIG } from '../config'

export function useLogout({ onSuccess, onError }: ApiHookProps = {}) {
  const { setStatus, setError, ...apiState } = useApiState()
  const { setUser } = useAuthContext()

  const logout = useCallback(async () => {
    setStatus('loading')

    try {
      await post(`/api/${CONFIG.API_FOLDER_NAME}/logout`, {})
      setUser()
      setStatus('idle')

      if (onSuccess) {
        onSuccess()
      }
    } catch (e) {
      const error = e as ApiError
      setError(error.message)
      setStatus('error')

      if (onError) {
        onError(error)
      }
    }
  }, [])

  return {
    ...apiState,
    logout
  }
}
