import { SubscriptionPlans } from '@/lib/constants'

export interface PricingItem {
  display_name: string
  icon: string
  id: string
  name: string
  pricing: {
    [key: string]: string
  }
  quotas: {
    [key: string]: string
  }
}

export interface SubscriptionItem {
  cost: string
  description: string
  features: string[]
  plan: SubscriptionPlans
}
