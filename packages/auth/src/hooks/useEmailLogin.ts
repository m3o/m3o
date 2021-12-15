import type { LoginRequest, Account } from 'm3o/user'
import type { ApiError, ApiHookProps } from '@m3o/types'
import { useCallback } from 'react'
import { post, useApiState } from '@m3o/ui'
import { useUser } from '../components/UserProvider'
import { CONFIG } from '../config'

type LoginFields = Pick<LoginRequest, 'email' | 'password'>

interface LoginResponse {
  account: Account
}

export function useEmailLogin({ onSuccess, onError }: ApiHookProps = {}) {
  const { setUser } = useUser()
  const { setStatus, setError, ...apiState } = useApiState()

  const login = useCallback(async (payload: LoginFields) => {
    setStatus('loading')

    try {
      const response = await post<LoginFields, LoginResponse>(
        `/api/${CONFIG.API_FOLDER_NAME}/login`,
        payload
      )

      setUser(response.account)
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
    login
  }
}
