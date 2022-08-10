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

  return useMutation(async (email: string) =>
    m3oApi.post('/signup/recover', { email }),
  )
}
