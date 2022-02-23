import { post } from '../fetch'
import { m3oInstance } from '../api'

interface GetCurrentBalance {
  userId: string
  token: string
}

interface GetCurrentBalanceRequest {
  customer_id: string
}

interface GetCurrentBalanceResponse {
  current_balance?: number
}

interface ListCardsResponse {
  cards: Card[]
}

interface GetStripeCheckoutSession {
  amount: number
  token: string
}

interface GetStripeCheckoutSessionRequest {
  amount: number
  save_card: boolean
}

interface GetStripeCheckoutSessionResponse {
  id: string
}

interface DeleteCard {
  token: string
  cardId: string
}

interface DeleteCardRequest {
  id: string
}

interface ChargeCard {
  amount: number
  cardId: string
  token: string
}

interface ChargeCardRequest {
  amount: number
  id: string
}

interface ChargeCardResponse {
  client_secret: string
}

enum BalanceEndpoints {
  ChargeCard = '/stripe/chargeCard',
  CheckoutSession = '/stripe/CreateCheckoutSession',
  Current = '/balance/Current',
  DeleteCard = '/stripe/deleteCard',
  ListCards = '/stripe/listCards',
}

export async function getCurrentBalance({
  userId,
  token,
}: GetCurrentBalance): Promise<number> {
  const {
    data: { current_balance = 0 },
  } = await m3oInstance.post<GetCurrentBalanceResponse>(
    BalanceEndpoints.Current,
    {
      customer_id: userId,
    },
    {
      headers: {
        'Micro-Namespace': 'micro',
        authorization: `Bearer ${token}`,
      },
    },
  )

  return current_balance / 1000000
}

export async function getStripeCheckoutSession({
  amount,
  token,
}: GetStripeCheckoutSession): Promise<string> {
  const response = await post<
    GetStripeCheckoutSessionRequest,
    GetStripeCheckoutSessionResponse
  >(
    BalanceEndpoints.CheckoutSession,
    {
      amount,
      save_card: true,
    },
    {
      headers: {
        'Micro-Namespace': 'micro',
        authorization: `Bearer ${token}`,
      },
    },
  )

  return response.id
}

export function deleteCard({ cardId, token }: DeleteCard): Promise<void> {
  return post<DeleteCardRequest, void>(
    BalanceEndpoints.DeleteCard,
    {
      id: cardId,
    },
    {
      headers: {
        'Micro-Namespace': 'micro',
        authorization: `Bearer ${token}`,
      },
    },
  )
}

export async function chargeCard({ cardId, amount, token }: ChargeCard) {
  try {
    const response = await post<ChargeCardRequest, ChargeCardResponse>(
      BalanceEndpoints.ChargeCard,
      {
        id: cardId,
        amount,
      },
      {
        headers: {
          'Micro-Namespace': 'micro',
          authorization: `Bearer ${token}`,
        },
      },
    )

    return response.client_secret
  } catch (e) {
    throw e
  }
}
