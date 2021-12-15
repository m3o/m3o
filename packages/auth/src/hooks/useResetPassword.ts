import type { ResetPasswordRequest } from 'm3o/user'
import type { ApiHookProps, ApiError } from '@m3o/types'
import { useCallback } from 'react'
import { useApiState, post } from '@m3o/ui'
import { CONFIG } from '../config'

type ResetPasswordPayload = Omit<ResetPasswordRequest, 'email'>

interface UseResetPassword extends ApiHookProps {
  email: string
}

export default function useResetPassword({
  email,
  onSuccess,
  onError
}: UseResetPassword) {
  const { setError, setStatus, ...apiState } = useApiState()

  const resetPassword = useCallback(
    async (payload: ResetPasswordPayload) => {
      setStatus('loading')

      try {
        await post(`/api/${CONFIG.API_FOLDER_NAME}/reset-password`, {
          ...payload,
          email
        })

        setStatus('idle')

        if (onSuccess) {
          onSuccess()
        }
      } catch (e) {
        const error = e as ApiError
        setStatus('error')
        setError(error.message)

        if (onError) {
          onError(error)
        }
      }
    },
    [setStatus, setError, email]
  )

  return {
    ...apiState,
    resetPassword
  }
}
