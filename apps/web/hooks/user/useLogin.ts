import type { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { loginUser } from '@/lib/api/local/user'
import { sessionStorage } from '@/utils/storage'
import { GET_STARTED_STORAGE_KEY, SessionStorageKeys } from '@/lib/constants'
import { shouldRedirectOnLogin, redirectToCloud } from '@/lib/redirect'

export function useLogin() {
  const router = useRouter()

  return useMutation(
    async (values: LoginFormFields) => {
      try {
        return await loginUser(values)
      } catch (e) {
        const error = e as AxiosError
        throw error.response?.data.detail
      }
    },
    {
      onSuccess: () => {
        const pathToReturnTo = sessionStorage.getItem(GET_STARTED_STORAGE_KEY)
        const subscriptionPath = sessionStorage.getItem(
          SessionStorageKeys.SubscriptionFlow,
        )

        if (subscriptionPath) {
          // Assume the user has come from clicking a subscription
          router.push(`/subscriptions?tier=${subscriptionPath}`)
          return
        }

        if (shouldRedirectOnLogin()) {
          redirectToCloud()
        } else {
          router.push(pathToReturnTo ? pathToReturnTo : '/')
          sessionStorage.deleteItem(GET_STARTED_STORAGE_KEY)
        }
      },
    },
  )
}
