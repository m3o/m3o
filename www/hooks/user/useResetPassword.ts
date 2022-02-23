import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { Routes } from '@/lib/constants'
import {
  resetPassword,
  ResetPasswordPayload,
} from '@/lib/api/m3o/services/auth'
import { useToast, ToastTypes } from '@/providers'

export function useResetPassword() {
  const { showToast } = useToast()
  const router = useRouter()

  return useMutation(
    (payload: ResetPasswordPayload) => resetPassword(payload),
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
