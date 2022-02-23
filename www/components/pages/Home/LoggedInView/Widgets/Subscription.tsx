import type { FC } from 'react'
import { useBillingAccount } from '@/hooks'
import { SubscriptionPlanBubble } from '@/components/ui'

export const Subscription: FC = () => {
  const { subscriptionLevel } = useBillingAccount()

  return (
    <div className="text-white mb-10">
      <h5 className="font-bold text-xl mb-4">Subscription Plan</h5>
      {subscriptionLevel && (
        <SubscriptionPlanBubble
          plan={subscriptionLevel}></SubscriptionPlanBubble>
      )}
    </div>
  )
}
