import type { FC } from 'react'
import { Subscriptions } from '@/components/ui'

export const Pricing: FC = () => {
  return (
    <section className="bg-white py-20 dark:bg-black">
      <div className="m3o-container sm p-16 text-center">
        <h3 className="description-heading">Pricing</h3>
        <h4 className="text-4xl my-4 pb-2 text-white font-bold">
          Our Plans
        </h4>
        <Subscriptions />
      </div>
    </section>
  )
}
