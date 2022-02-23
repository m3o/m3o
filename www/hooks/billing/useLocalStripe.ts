import { useRef } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const STRIPE_TEST_KEY = process.env.NEXT_PUBLIC_TEST_STRIPE_KEY as string
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY as string

export function useLocalStripe(user: Account) {
  const stripePromiseRef = useRef(
    loadStripe(user.name.includes('@m3o.com') ? STRIPE_TEST_KEY : STRIPE_KEY),
  )

  return stripePromiseRef
}
