import type { ReactElement } from 'react'
import Link from 'next/link'
import { Subscription } from './Subscription'
import { SubscriptionPlans } from '@/lib/constants'

export function Subscriptions(): ReactElement {
  return (
    <div className="grid xl:grid-cols-4 mt-10 text-left gap-4">
      <Subscription
        cost="Pay as you grow"
        plan={SubscriptionPlans.Free}
        description="For testing and hacking"
        features={[
          '7 day free trial',
          '1M requests per credit',
          '100 User accounts',
          '1000 DB records',
          '1GB Space storage',
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
        cost="£10/month"
        plan={SubscriptionPlans.Solo}
        description="For creators and developers"
        features={[
          'Everything in Free plus',
          '5M requests in credit',
          '1000 User accounts',
          '10,000 DB records',
          '10GB Space storage',
          'Community support',
        ]}
        button={
          <Link href="/register?subscription=solo">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-solo-start-button">
              Buy Solo
            </a>
          </Link>
        }
      />
      <Subscription
        cost="£20/month"
        plan={SubscriptionPlans.Pro}
        description="For professionals and teams"
        features={[
          'Everything in Solo plus',
          'Increased rate limits',
          '10M requests in credit',
          '10,000 User accounts',
          '100,000 DB records',
          '100GB Space storage',
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
        cost="£200/month"
        plan={SubscriptionPlans.Business}
        description="For growing businesses"
        features={[
          'Everything in Pro plus',
          '100M requests in credit',
          '100,000 User accounts',
          '1M DB records',
          '1TB Space storage',
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
