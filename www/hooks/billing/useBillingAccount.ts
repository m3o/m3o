import type { BillingAccount } from '@/types'
import { useQuery } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OApi } from '@/hooks'

interface ReadBillingAccountResponse {
  billing_account: BillingAccount
}

export function useBillingAccount() {
  const m3o = useM3OApi()

  const { data, isLoading } = useQuery(
    QueryKeys.BillingAccount,
    async function (): Promise<BillingAccount> {
      const response = await m3o.post<ReadBillingAccountResponse>(
        '/billing/readAccount',
        {},
      )

      return response.data.billing_account
    },
  )

  return {
    billingAccount: data,
    isLoading,
    subscriptionLevel: data?.subscriptions[0].id,
  }
}
