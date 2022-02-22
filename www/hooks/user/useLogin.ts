import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { loginUser } from '@/lib/api/local/user'
import { sessionStorage } from '@/utils/storage'
import { GET_STARTED_STORAGE_KEY, SessionStorageKeys } from '@/lib/constants'
import { shouldRedirectOnLogin, redirectToCloud } from '@/lib/redirect'

export function useLogin() {
  const router = useRouter()

  return useMutation((values: LoginFormFields) => loginUser(values), {
    onSuccess: () => {
      const pathToReturnTo = sessionStorage.getItem(GET_STARTED_STORAGE_KEY)
      const subscriptionPath = sessionStorage.getItem(
        SessionStorageKeys.SubscriptionFlow,
      )

      if (subscriptionPath === 'pro') {
        // Assume the user has come from clicking a subscription
        router.push('/subscriptions/pro/card-details')
        return
      }

      if (shouldRedirectOnLogin()) {
        redirectToCloud()
      } else {
        router.push(pathToReturnTo ? pathToReturnTo : '/')
        sessionStorage.deleteItem(GET_STARTED_STORAGE_KEY)
      }
    },
  })
}
