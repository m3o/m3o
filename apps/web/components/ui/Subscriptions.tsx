import type { ReactElement } from 'react'
import Link from 'next/link'
import { Subscription } from './Subscription'
import { SubscriptionPlans } from '@/lib/constants'

export function Subscriptions(): ReactElement {
  return (
    <div className="grid xl:grid-cols-4 mt-10 text-left gap-4">
      <Subscription
        cost="Start for Free"
        plan={SubscriptionPlans.Free}
        description="For testing"
        features={[
          'Pay as you grow',
          '1k requests/month',
          '5 requests/second',
          'Unlimited API tokens',
        ]}
        button={
          <Link href="/register">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-dev-start-button">
              Get Started
            </a>
          </Link>
        }
      />
      <Subscription
        cost="$10/month"
        plan={SubscriptionPlans.Solo}
        description="For individuals"
        features={[
          'Everything in Free plus',
          'Unlock Premium APIs',
	  '10k requests/month',
          '10 request/second',
        ]}
        button={
          <Link href="/register?subscription=solo">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-solo-start-button">
              Choose Solo
            </a>
          </Link>
        }
      />
      <Subscription
        cost="$35/month"
        plan={SubscriptionPlans.Pro}
        description="For professionals"
        features={[
          'Everything in Solo plus',
	  '100k requests/month',
          '100 requests/second',
          'Email support',
        ]}
        button={
          <Link href="/register?subscription=pro">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-pro-start-button">
              Choose Pro
            </a>
          </Link>
        }
      />
      <Subscription
        cost="$95/month"
        plan={SubscriptionPlans.Business}
        description="For businesses"
        features={[
          'Everything in Pro plus',
          '1M requests/month',
          '1000 requests/second',
          'Premium support',
        ]}
        button={
          <Link href="/register?subscription=business">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-business-start-button">
              Choose Business
            </a>
          </Link>
        }
      />
    </div>
  )
}
