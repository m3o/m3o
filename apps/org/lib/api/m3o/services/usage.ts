import type { Usage, RankApi, RankUser } from '@/types'
import { m3oInstance } from '../api'

interface ListUsage {
  userId: string
  token: string
}

interface ListResponse {
  usage: Usage
}

export interface AllRanksResponse {
  global_top_users: RankUser[]
  ranks: RankApi[]
}

enum UsageEndpoints {
  ApiRanks = 'usage/ListAPIRanks',
  Read = '/usage/Read',
}

export async function listUsage({
  userId,
  token,
}: ListUsage): Promise<ListResponse['usage']> {
  const response = await m3oInstance.post<ListResponse>(
    UsageEndpoints.Read,
    {
      customer_id: userId,
    },
    {
      headers: {
        'Micro-Namespace': 'micro',
        authorization: 'Bearer ' + token,
      },
    },
  )

  return response.data.usage
}

export function fetchAllRanks() {
  return m3oInstance.post<AllRanksResponse>(UsageEndpoints.ApiRanks)
}

export async function fetchApiRanks(
  apiName: string,
): Promise<RankApi | undefined> {
  const response = await fetchAllRanks()
  return response.data.ranks.find(item => item.api_name === apiName)
}
