import type { FC, ReactNode } from 'react'
import type { SubscriptionItem } from '@/types'
import classNames from 'classnames'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/solid'

interface Props extends SubscriptionItem {
  button: ReactNode
}

export const Subscription: FC<Props> = ({
  cost,
  button,
  plan,
  description,
  features,
}) => {
  const isProPlan = plan === 'pro'

  return (
    <div
      className={classNames(
        'border tbc rounded-lg ttc overflow-hidden bg-white dark:bg-zinc-800',
        {
          'md:scale-90': !isProPlan,
        },
      )}>
      <div className={classNames('p-8', { 'gradient-bg': isProPlan })}>
        <h5
          className={classNames('font-bold text-3xl mb-2 capitalize', {
            'text-white': isProPlan,
            'text-black dark:text-white': !isProPlan,
          })}>
          {plan}
        </h5>
        <h6
          className={classNames('mb-2 capitalize', {
            'text-white': isProPlan,
            'text-zinc-500 dark:text-white': !isProPlan,
          })}>
          {description}
        </h6>
        <p className={classNames('font-bold', { 'text-white': isProPlan })}>
          {cost}
        </p>
      </div>
      <div className="border-t dark:border-zinc-700 p-6 tgbc">
        <ul>
          {features.map(feature => (
            <li
              key={feature}
              className="grid grid-cols-7 items-center mb-4 last:mb-0">
              <span>
                <CheckCircleIcon className="w-6 mr-2" />
              </span>
              <span className="col-span-6">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t dark:border-zinc-700 p-6">{button}</div>
    </div>
  )
}
