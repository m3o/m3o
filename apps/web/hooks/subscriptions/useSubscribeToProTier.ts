import type { AxiosError } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { QueryKeys, BillingApiRoutes } from '@/lib/constants'
import { useM3OApi } from '@/hooks'

interface UseSubscribeToProTierProps {
  onSuccess?: VoidFunction
}

export function useSubscribeToProTier({
  onSuccess,
}: UseSubscribeToProTierProps = {}) {
  const m3oApi = useM3OApi()
  const queryClient = useQueryClient()

  const { mutate, isLoading, error } = useMutation(
    async (card_id: string) => {
      try {
        const response = await m3oApi.post(BillingApiRoutes.SubscribeTier, {
          card_id,
          id: 'pro',
        })

        return response
      } catch (e) {
        const error = e as AxiosError
        throw (error.response!.data as ApiError).Detail
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

  return {
    subscribe: mutate,
    isLoading,
    error,
  }
}
