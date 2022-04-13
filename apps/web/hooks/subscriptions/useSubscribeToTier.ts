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
    async ({ card_id, id }: MutationProps) => {
      try {
        const response = await m3oApi.post(BillingApiRoutes.SubscribeTier, {
          card_id,
          id,
        })

        return response
      } catch (e) {
        const error = e as AxiosError
        throw (error.response!.data as ApiError).detail
      }
    },
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
