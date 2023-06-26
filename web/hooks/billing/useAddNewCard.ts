import { useCallback } from 'react'
import { useCookies } from 'react-cookie'
import { getStripeCheckoutSession } from '@/lib/api/m3o/services/balance'
import { AuthCookieNames } from '@/lib/constants'
import { useBillingContext } from '@/providers'

export function useAddNewCard() {
  const { stripe } = useBillingContext()
  const [cookies] = useCookies()

  const onAddNewCard = useCallback(async () => {
    try {
      const resolvedStripe = await stripe

      if (!resolvedStripe) {
        return
      }

      const sessionId = await getStripeCheckoutSession({
        amount: 0 * 100,
        token: cookies[AuthCookieNames.Token],
      })

      const result = await resolvedStripe.redirectToCheckout({
        sessionId: sessionId,
      })

      if (result.error) {
        console.log(result.error.message)
      }
    } catch (e) {
      console.log(e)
    }
  }, [cookies, stripe])

  return onAddNewCard
}
