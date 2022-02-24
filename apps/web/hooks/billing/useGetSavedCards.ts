import type { Card } from '@/types'
import { useQuery } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OApi } from '../m3o/useM3OApi'

interface ListCardsResponse {
  cards: Card[]
}

interface UseGetSavedCards {
  cards: Card[]
  isLoading: boolean
}

export function useGetSavedCards(): UseGetSavedCards {
  const m3oApi = useM3OApi()

  const { data = [], isLoading } = useQuery(
    QueryKeys.SavedCards,
    async (): Promise<Card[]> => {
      const response = await m3oApi.post<ListCardsResponse>(
        '/stripe/listCards',
        {},
      )

      return response.data.cards
    },
  )

  return {
    cards: data,
    isLoading,
  }
}
