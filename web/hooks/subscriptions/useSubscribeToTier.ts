import type { AxiosError } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { QueryKeys, BillingApiRoutes, SubscriptionPlans } from '@/lib/constants'
import { useM3OApi } from '@/hooks'

interface UseSubscribeToProTierProps {
  onSuccess?: VoidFunction
}

interface MutationProps {
  card_id: string
  id: SubscriptionPlans
}

export function useSubscribeToTier({
  onSuccess,
}: UseSubscribeToProTierProps = {}) {
  const m3oApi = useM3OApi()
  const queryClient = useQueryClient()

  return useMutation(
    ({ card_id, id }: MutationProps) =>
      m3oApi.post(BillingApiRoutes.SubscribeTier, {
        card_id,
        id,
      }),

    {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess()
          queryClient.invalidateQueries(QueryKeys.BillingAccount)
        }
      },
    },
  )
}
