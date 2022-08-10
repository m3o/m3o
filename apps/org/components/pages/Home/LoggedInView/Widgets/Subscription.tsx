import type { FC } from 'react'
import Link from 'next/link'
import { useBillingAccount } from '@/hooks'
import { SubscriptionPlanBubble } from '@/components/ui'
import { Routes } from '@/lib/constants'

export const Subscription: FC = () => {
  const { subscriptionLevel } = useBillingAccount()

  return (
    <div className="text-white">
      <h5 className="font-bold text-xl mb-4">Subscription</h5>
      {subscriptionLevel && (
        <span className="mb-2 inline-block">
          <SubscriptionPlanBubble
            plan={subscriptionLevel}></SubscriptionPlanBubble>
        </span>
      )}
      <div className="mt-2">
        <Link href={Routes.UserBilling}>
          <a className="mt-4 text-xs align-middle">
            Change Plan
          </a>    
        </Link>
      </div>
    </div>
  )
}
