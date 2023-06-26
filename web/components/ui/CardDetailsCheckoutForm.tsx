import type { FC, FormEvent } from 'react'
import { useState } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui'
import { useSetupCard } from '@/hooks'
import { Spinner } from './Spinner'

interface Props {
  handleSubscribe: (cardId: string) => void
}

export const CardDetailsCheckoutForm: FC<Props> = ({ handleSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const { data: clientSecret } = useSetupCard()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    if (!stripe || !elements || !clientSecret) {
      return
    }

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement)!,
      },
    })

    if (result.error) {
      setIsLoading(false)
    } else {
      handleSubscribe(result.setupIntent.payment_method!)
    }
  }

  if (!clientSecret) {
    return <Spinner />
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label className="text-black dark:text-white block mb-2 font-medium">
            Card Number
          </label>
          <CardNumberElement className="stripe-card" />
        </div>
        <div className="mt-4">
          <label className="text-black dark:text-white block mb-2 font-medium">
            Expiry Date
          </label>
          <CardExpiryElement className="stripe-card" />
        </div>
        <div className="mt-4">
          <label className="text-black dark:text-white block mb-2 font-medium">
            CVC
          </label>
          <CardCvcElement className="stripe-card" />
        </div>
        <Button type="submit" loading={isLoading} className="mt-6">
          Submit
        </Button>
      </form>
    </div>
  )
}
