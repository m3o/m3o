import type { VerifySignUpPayload } from 'types/user'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { apiInstance } from '@/lib/api/local/api'
import { Routes } from '@/lib/constants'

export function useVerifySignUp() {
  const router = useRouter()

  return useMutation(
    (payload: VerifySignUpPayload) =>
      apiInstance.post('/user/verify-signup', payload),
    {
      onSuccess: () => {
        router.push({
          pathname: Routes.Login,
          query: {
            successful_register: true,
          },
        })
      },
    },
  )
}
