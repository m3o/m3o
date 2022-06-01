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
        description="For small projects"
        features={[
          '10k requests to start',
          '1M requests per credit',
          '10 requests a second',
          '100 User accounts',
          '1000 DB records',
          '1GB Space storage',
        ]}
        button={
          <Link href="https://discord.gg/TBR9bRjd6Z">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-free-start-button">
              Request Access
            </a>
          </Link>
        }
      />
      <Subscription
        cost="£20/month"
        plan={SubscriptionPlans.Solo}
        description="For creators and developers"
        features={[
          'Everything in Free plus',
          '5M requests in credit',
          '100 requests a second',
          '1000 User accounts',
          '10,000 DB records',
          '10GB Space storage',
          'Community support',
        ]}
        button={
          <Link href="https://discord.gg/TBR9bRjd6Z">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-solo-start-button">
              Request Access
            </a>
          </Link>
        }
      />
      <Subscription
        cost="£40/month"
        plan={SubscriptionPlans.Pro}
        description="For professionals and teams"
        features={[
          'Everything in Solo plus',
          '10M requests in credit',
          '1000 requests a second',
          '10,000 User accounts',
          '100,000 DB records',
          '100GB Space storage',
          'Email support',
        ]}
        button={
          <Link href="https://discord.gg/TBR9bRjd6Z">
            <a
              className="btn block w-full text-center"
              data-testid="subscription-pro-start-button">
              Request Access
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
          '100M requests in credit',
          '10,000 requests a second',
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
