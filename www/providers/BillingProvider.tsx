import { createContext, FC, useContext, useState, useRef } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

interface BillingProviderProps {
  user: Account
}

interface BillingContextReturn {
  cardToDelete?: Card
  setCardToDelete: (card: Card | undefined) => void
  stripe: Promise<Stripe | null>
}

const STRIPE_TEST_KEY = process.env.NEXT_PUBLIC_TEST_STRIPE_KEY as string
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY as string
const BillingContext = createContext({} as BillingContextReturn)

export const BillingProvider: FC<BillingProviderProps> = ({
  children,
  user,
}) => {
  const stripeRef = useRef(
    loadStripe(user.name.includes('@m3o.com') ? STRIPE_TEST_KEY : STRIPE_KEY),
  )

  const [cardToDelete, setCardToDelete] = useState<Card | undefined>(undefined)

  return (
    <BillingContext.Provider
      value={{
        cardToDelete,
        setCardToDelete,
        stripe: stripeRef.current,
      }}>
      {children}
    </BillingContext.Provider>
  )
}

export function useBillingContext() {
  return useContext(BillingContext)
}
