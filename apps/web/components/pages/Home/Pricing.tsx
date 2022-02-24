import type { FC } from 'react'
import { Subscriptions } from '@/components/ui'

export const Pricing: FC = () => {
  return (
    <section className="bg-white py-20 dark:bg-zinc-900">
      <div className="m3o-container sm p-16 text-center">
        <h3 className="description-heading">Subscriptions</h3>
        <h4 className="text-4xl my-4 pb-2 gradient-text font-bold">
          Our subscription plans
        </h4>
        <Subscriptions />
      </div>
    </section>
  )
}
