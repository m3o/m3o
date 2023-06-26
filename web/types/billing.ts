import { SubscriptionPlans } from '@/lib/constants'

export interface Subscription {
  id: SubscriptionPlans
}

export interface BillingAccount {
  admins: string[]
  id: string
  members: string[]
  subscriptions: Subscription[]
}

export interface Card {
  last_four: string
  id: string
  expires: string
}

export interface Adjustment {
  id: string
  created: string
  delta: number
  reference: string
  meta: any
}
