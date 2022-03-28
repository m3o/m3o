import type { WithAuthProps } from '@/lib/api/m3o/withAuth'
import { useRouter } from 'next/router'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { Routes, SubscriptionPlans } from '@/lib/constants'
import { SubscriptionsLayout } from '@/components/layouts'
import { useLocalStripe, useGetSavedCards, useSubscribeToTier } from '@/hooks'
import {
  CardDetailsCheckoutForm,
  Spinner,
  Button,
  Alert,
} from '@/components/ui'
import { PaymentMethods } from '@/components/pages/subscriptions'

interface Props extends WithAuthProps {
  tier: SubscriptionPlans
}

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: Routes.Home,
        permanent: true,
      },
    }
  }

  return {
    props: {
      tier: context.query.tier,
      user: context.req.user,
    },
  }
})

export default function SubscriptionsCardDetails({ user, tier }: Props) {
  const [cardId, setCardId] = useState('')
  const router = useRouter()
  const {
    mutate,
    isLoading: isCompleting,
    error,
  } = useSubscribeToTier({
    onSuccess: () => {
      router.push(Routes.SubscriptionSuccess)
    },
  })
  const { cards, isLoading } = useGetSavedCards()
  const stripePromise = useLocalStripe(user!)

  useEffect(() => {
    if (cards.length === 1) {
      setCardId(cards[0].id)
    }
  }, [cards])

  if (isLoading) {
    return <Spinner />
  }

  const handleSubscribe = () => {
    return mutate({ card_id: cardId, id: tier })
  }

  return (
    <SubscriptionsLayout>
      {error && (
        <Alert type="error" className="mb-6">
          {error as string}
        </Alert>
      )}
      <h2 className="ttc tbc border-b pb-8 md:text-lg">
        Please {cards.length ? 'select a card' : 'add a new card'}. You will be
        charged monthly from now until cancellation.
      </h2>
      {cards.length ? (
        <>
          <PaymentMethods
            cards={cards}
            handleCardClick={setCardId}
            selectedCard={cardId}
          />
          <Button
            disabled={!cardId}
            onClick={handleSubscribe}
            loading={isCompleting}>
            Upgrade
          </Button>
        </>
      ) : (
        <Elements stripe={stripePromise.current}>
          <CardDetailsCheckoutForm handleSubscribe={handleSubscribe} />
        </Elements>
      )}
    </SubscriptionsLayout>
  )
}
