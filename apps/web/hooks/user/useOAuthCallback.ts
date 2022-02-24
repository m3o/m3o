import type { SignUpResponse, OAuthCallbackRequest } from '@/types'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { apiInstance } from '@/lib/api/local/api'
import { handleSuccessfulOAuthLogin } from '@/lib/api/local/user'

export function useOAuthCallback(url: string) {
  const router = useRouter()

  return useMutation(
    (payload: OAuthCallbackRequest) =>
      apiInstance.post<SignUpResponse>(url, payload),
    {
      retry: false,
      onSuccess: () => {
        handleSuccessfulOAuthLogin(router)
      },
    },
  )
}
