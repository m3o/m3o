import { useCookies } from 'react-cookie'
import { useMutation, useQueryClient } from 'react-query'
import { deleteCard } from '@/lib/api/m3o/services/balance'
import { AuthCookieNames, QueryKeys } from '@/lib/constants'
import { useBillingContext } from '@/providers'

export function useDeleteCard() {
  const queryClient = useQueryClient()
  const { setCardToDelete, cardToDelete } = useBillingContext()
  const [cookies] = useCookies()

  return useMutation(
    () =>
      deleteCard({
        cardId: cardToDelete!.id,
        token: cookies[AuthCookieNames.Token],
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.SavedCards)
        setCardToDelete(undefined)
      },
    },
  )
}
