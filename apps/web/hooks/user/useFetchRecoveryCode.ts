import type { AxiosError, AxiosResponse } from 'axios'
import type { UseMutationResult } from 'react-query'
import { useMutation } from 'react-query'
import { useM3OApi } from '..'

export function useFetchRecoveryCode(): UseMutationResult<
  AxiosResponse<any>,
  string,
  string,
  unknown
> {
  const m3oApi = useM3OApi()

  return useMutation(async (email: string) => {
    try {
      return await m3oApi.post('/onboarding/signup/recover', { email })
    } catch (e) {
      const error = e as AxiosError
      throw (error.response?.data as ApiError).detail
    }
  })
}
