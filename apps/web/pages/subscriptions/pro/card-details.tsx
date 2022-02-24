import type { NextPage } from 'next'
import type { WithAuthProps } from '@/lib/api/m3o/withAuth'
import { useRouter } from 'next/router'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { Routes, SessionStorageKeys } from '@/lib/constants'
import { SubscriptionsLayout } from '@/components/layouts'
import {
  useLocalStripe,
  useGetSavedCards,
  useSubscribeToProTier,
} from '@/hooks'
import {
  CardDetailsCheckoutForm,
  Spinner,
  Button,
  Alert,
} from '@/components/ui'
import { PaymentMethods } from '@/components/pages/subscriptions'

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
      user: context.req.user,
    },
  }
})

const SubscriptionsProCardDetails: NextPage<WithAuthProps> = ({ user }) => {
  const [cardId, setCardId] = useState('')
  const router = useRouter()
  const {
    subscribe,
    isLoading: isCompleting,
    error,
  } = useSubscribeToProTier({
    onSuccess: () => {
      router.push(Routes.SubscriptionProSuccess)
    },
  })
  const { cards, isLoading } = useGetSavedCards()
  const stripePromise = useLocalStripe(user!)

  useEffect(() => {
    window.sessionStorage.removeItem(SessionStorageKeys.SubscriptionFlow)
  }, [])

  useEffect(() => {
    if (cards.length === 1) {
      setCardId(cards[0].id)
    }
  }, [cards])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <SubscriptionsLayout>
      {error && (
        <Alert type="error" className="mb-6">
          {error as string}
        </Alert>
      )}
      <h2 className="ttc border-b tbc pb-8 text-lg">
        Thank you for choosing M3O Pro. Please{' '}
        {cards.length ? 'select a card' : 'add a new card'}
        {` `} to pay the first $25 of your subscription. You will be charged
        monthly from now till cancellation.
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
            onClick={() => subscribe(cardId)}
            loading={isCompleting}>
            Complete
          </Button>
        </>
      ) : (
        <Elements stripe={stripePromise.current}>
          <CardDetailsCheckoutForm handleSubscribe={subscribe} />
        </Elements>
      )}
    </SubscriptionsLayout>
  )
}

export default SubscriptionsProCardDetails
