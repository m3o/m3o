import type { ApiHookProps } from '@m3o/types'
import { useCallback } from 'react'
import { CreateRequest } from 'm3o/user'
import { post, useApiState } from '@m3o/ui'
import { CONFIG } from '../config'

export function useSignUp({ onSuccess, onError }: ApiHookProps = {}) {
  const { setStatus, setError, ...apiState } = useApiState()

  const signUp = useCallback(async (payload: CreateRequest) => {
    setStatus('loading')

    try {
      await post<CreateRequest, {}>(
        `/api/${CONFIG.API_FOLDER_NAME}/sign-up`,
        payload
      )
      setStatus('idle')

      if (onSuccess) {
        onSuccess()
      }
    } catch (e) {
      const error = e as { message: string }
      setError(error.message)
      setStatus('error')

      if (onError) {
        onError(error)
      }
    }
  }, [])

  return {
    ...apiState,
    signUp
  }
}
