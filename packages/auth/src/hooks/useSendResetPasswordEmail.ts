import type { ApiError } from '@m3o/types'
import { useCallback } from 'react'
import { useApiState, post } from '@m3o/ui'
import { CONFIG } from '../config'

interface SendResetPasswordEmailProps {
  email: string
}

interface UseSendResetPasswordProps {
  onSuccess?: (email: string) => void
  onError?: (error: ApiError) => void
}

export default function useSendResetPasswordEmail({
  onSuccess,
  onError
}: UseSendResetPasswordProps) {
  const { setError, setStatus, ...apiState } = useApiState()

  const sendResetPasswordEmail = useCallback(
    async ({ email }: SendResetPasswordEmailProps) => {
      setStatus('loading')

      try {
        await post(`/api/${CONFIG.API_FOLDER_NAME}/send-password-reset-email`, {
          email
        })

        if (onSuccess) {
          onSuccess(email)
        }

        setStatus('idle')
      } catch (e) {
        const error = e as ApiError
        setError(error.message)
        setStatus('error')

        if (onError) {
          onError(error)
        }
      }
    },
    []
  )

  return {
    ...apiState,
    sendResetPasswordEmail
  }
}
