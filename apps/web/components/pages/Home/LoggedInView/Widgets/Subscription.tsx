import type { FC } from 'react'
import Link from 'next/link'
import { useBillingAccount } from '@/hooks'
import { SubscriptionPlanBubble } from '@/components/ui'
import { SubscriptionPlans } from '@/lib/constants'

type SubscriptionUpgradeLinksProps = {
  level: SubscriptionPlans
}

const LINK_CLASSES = 'text-sm inline-flex items-center'

type Link = {
  tier: SubscriptionPlans
  show?: (tier: SubscriptionPlans) => boolean
}

const LINKS: Link[] = [
  {
    tier: SubscriptionPlans.Pro,
  },
  {
    tier: SubscriptionPlans.Solo,
    show: tier => tier !== SubscriptionPlans.Solo,
  },
]

function SubscriptionUpgradeLinks({ level }: SubscriptionUpgradeLinksProps) {
  return (
    <div>
      {LINKS.map(link => {
        if (!link.show || link.show(level)) {
          return (
            <Link href={`/subscriptions?tier=${link.tier}`}>
              <a className={LINK_CLASSES}>Upgrade to {link.tier}</a>
            </Link>
          )
        }

        return null
      })}
    </div>
  )
}

export const Subscription: FC = () => {
  const { subscriptionLevel } = useBillingAccount()

  return (
    <div className="text-white">
      <h5 className="font-bold text-xl mb-4">Subscription Plan</h5>
      {subscriptionLevel && (
        <span className="mb-2 inline-block">
          <SubscriptionPlanBubble
            plan={subscriptionLevel}></SubscriptionPlanBubble>
        </span>
      )}
      {(subscriptionLevel === SubscriptionPlans.Free ||
        subscriptionLevel === SubscriptionPlans.Solo) && (
        <SubscriptionUpgradeLinks
          level={subscriptionLevel as SubscriptionPlans}
        />
      )}
    </div>
  )
}
