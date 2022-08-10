import { useQuery } from 'react-query'
import { useM3OApi } from '@/hooks'
import { QueryKeys } from '@/lib/constants'

interface SetupCardResponse {
  client_secret: string
}

export function useSetupCard() {
  const m3o = useM3OApi()

  return useQuery(QueryKeys.SetupCard, async () => {
    const {
      data: { client_secret },
    } = await m3o.post<SetupCardResponse>('billing/setupCard', {})

    return client_secret
  })
}
