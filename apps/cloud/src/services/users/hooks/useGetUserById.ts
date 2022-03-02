import type { ReadResponse } from 'm3o/user'
import { useQuery } from 'react-query'
import { m3oClient } from '../../../lib/m3o-client'

export function useGetUserById(id: string) {
  return useQuery(['user', id], async () => {
    const response = await m3oClient.post<ReadResponse>('user/read', { id })
    return response.data.account
  })
}
