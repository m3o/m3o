import type { ReactElement } from 'react'
import Link from 'next/link'
import { Subscription } from './Subscription'
import { SubscriptionPlans } from '@/lib/constants'

export function Subscriptions(): ReactElement {
  return (
    <div className="grid md:grid-cols-3 mt-10 text-left gap-4">
      <Subscription
        cost="Free to start"
        plan={SubscriptionPlans.Free}
        description="For individuals and hackers"
        features={[
          'Access to 50+ public APIs',
          '1 million api calls per month',
          'Top-up to pay as you grow',
          'Community support',
        ]}
        button={
          <Link href="/register">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-solo-start-button">
              Start For Free
            </a>
          </Link>
        }
      />
      <Subscription
        cost="$25/month"
        plan={SubscriptionPlans.Pro}
        description="For professionals and small business"
        features={[
          'Everything in Free plus',
          '20 million requests per month',
          'Increased rate limits',
          'Email support',
        ]}
        button={
          <Link href="/register?subscription=pro">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-pro-start-button">
              Buy Pro
            </a>
          </Link>
        }
      />
      <Subscription
        cost="$45/user/month"
        plan={SubscriptionPlans.Team}
        description="For growing companies"
        features={[
          'Everything in Pro plus',
          '100 million requests per month',
          'Shared projects and resources',
          'Premium support',
        ]}
        button={
          <a
            className="btn block w-full text-center"
            data-testid="subscription-solo-start-button"
            href="mailto:contact@m3o.com?subject=M3O Team Subscription">
            Contact Us
          </a>
        }
      />
    </div>
  )
}
