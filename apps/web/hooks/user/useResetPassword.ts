import type { AxiosError, AxiosResponse } from 'axios'
import type { UseMutationResult } from 'react-query'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { Routes } from '@/lib/constants'
import { useM3OApi } from '..'
import { ResetPasswordPayload } from '@/lib/api/m3o/services/auth'
import { useToast, ToastTypes } from '@/providers'

export function useResetPassword(): UseMutationResult<
  AxiosResponse<any>,
  string,
  ResetPasswordPayload,
  unknown
> {
  const { showToast } = useToast()
  const router = useRouter()
  const m3oApi = useM3OApi()

  return useMutation(
    async payload => {
      try {
        return await m3oApi.post('/onboarding/signup/resetPassword', payload)
      } catch (e) {
        const error = e as AxiosError
        throw (error.response?.data as ApiError).detail
      }
    },
    {
      onSuccess: () => {
        router.push(Routes.Login)

        showToast({
          title: 'Success',
          message: 'Successfully updated password',
          type: ToastTypes.Success,
        })
      },
    },
  )
}
