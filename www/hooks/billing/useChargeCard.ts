import { useCookies } from 'react-cookie'
import { useMutation, useQueryClient } from 'react-query'
import { chargeCard } from '@/lib/api/m3o/services/balance'
import { AuthCookieNames, QueryKeys } from '@/lib/constants'
import { useToast, ToastTypes } from '@/providers'
import { useBillingContext } from '../../providers/BillingProvider'

interface UseChargeCardMutateProps {
  cardId: string
  amount: number
}

export function useChargeCard() {
  const { stripe } = useBillingContext()
  const queryClient = useQueryClient()
  const [cookies] = useCookies()
  const { showToast } = useToast()

  return useMutation(
    async ({ amount, cardId }: UseChargeCardMutateProps) => {
      const clientSecret = await chargeCard({
        token: cookies[AuthCookieNames.Token],
        amount: amount * 100,
        cardId,
      })

      if (clientSecret && clientSecret.length) {
        const resolvedStripe = await stripe

        if (resolvedStripe) {
          const result = await resolvedStripe.confirmCardPayment(clientSecret)

          if (result.error) {
            return Promise.reject(result.error)
          }
        }
      }
    },
    {
      onSuccess: async (_, variables) => {
        queryClient.invalidateQueries(QueryKeys.History)

        setTimeout(() => {
          // This is a hack as the API doesn't seem to update in time to get the actual balance.
          queryClient.invalidateQueries(QueryKeys.CurrentBalance)
        }, 500)

        showToast({
          message: `Successfully added $${variables.amount} to your balance`,
          title: 'Success',
          type: ToastTypes.Success,
        })
      },
    },
  )
}
