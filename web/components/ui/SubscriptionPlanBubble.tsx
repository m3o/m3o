import type { ReactElement } from 'react'
import classNames from 'classnames'
import { SubscriptionPlans } from '@/lib/constants'

interface Props {
  plan: SubscriptionPlans
}

export function SubscriptionPlanBubble({ plan }: Props): ReactElement {
  return (
    <span
      className={classNames(
        'capitalize inline-block rounded-full py-1 px-6 text-sm font-bold text-white',
        {
          'gradient-bg': plan !== SubscriptionPlans.Free,
          'bg-zinc-700': plan === SubscriptionPlans.Free,
        },
      )}>
      {plan}
    </span>
  )
}
