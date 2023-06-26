import { useMutation, useQueryClient } from 'react-query'
import { useM3OApi } from '../m3o/useM3OApi'
import { QueryKeys, BillingApiRoutes } from '@/lib/constants'

interface UseDowngradeToFreeTierProps {
  onSuccess?: VoidFunction
}

export function useDowngradeToFreeTier({
  onSuccess,
}: UseDowngradeToFreeTierProps = {}) {
  const m3oApi = useM3OApi()
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    () =>
      m3oApi.post(BillingApiRoutes.SubscribeTier, {
        id: 'free',
      }),
    {
      onSuccess: () => {
        onSuccess && onSuccess()
        queryClient.invalidateQueries(QueryKeys.BillingAccount)
      },
    },
  )

  return {
    downgrade: mutate,
    isLoading,
  }
}
