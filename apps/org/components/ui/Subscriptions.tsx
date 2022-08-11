import type { ReactElement } from 'react'
import Link from 'next/link'
import { Subscription } from './Subscription'
import { SubscriptionPlans } from '@/lib/constants'

export function Subscriptions(): ReactElement {
  return (
    <div className="grid xl:grid-cols-4 mt-10 text-left gap-4">
      <Subscription
        cost="Free to start"
        plan={SubscriptionPlans.Free}
        description="For small projects"
        features={[
          'Top-up via credit card',
          '1M messages',
          '100 users',
          '1000 posts',
          '1GB storage',
        ]}
        button={
          <Link href="/register">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-free-start-button">
              Get Started
            </a>
          </Link>
        }
      />
      <Subscription
        cost="£20/month"
        plan={SubscriptionPlans.Solo}
        description="For creators and individuals"
        features={[
          'Everything in Free plus',
          '5M messages',
          '1000 users',
          '10,000 posts',
          '10GB storage',
          'Community support',
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
        cost="£100/month"
        plan={SubscriptionPlans.Pro}
        description="For professionals and teams"
        features={[
          'Everything in Solo plus',
          '25M messages',
          '10,000 users',
          '100,000 posts',
          '100GB storage',
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
        cost="Custom pricing"
        plan={SubscriptionPlans.Business}
        description="For growing companies"
        features={[
          'Everything in Pro plus',
          '100M messages',
          '100,000 users',
          '1M posts',
          '1TB storage',
          'Premium support',
        ]}
        button={
          <a
            className="btn block w-full text-center"
            data-testid="subscription-business-start-button"
            href="mailto:contact@m3o.com?subject=M3O Business Plan">
            Contact Us
          </a>
        }
      />
    </div>
  )
}
