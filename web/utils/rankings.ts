import { RankApi } from '@/types'

export function sortRankApiByName(a: RankApi, b: RankApi) {
  if (a.api_name < b.api_name) {
    return -1
  }

  return 1
}

export function sortApisByPosition(apis: RankApi[]) {
  return apis.sort((a, b) => {
    if (a.position < b.position) {
      return -1
    }

    return 1
  })
}

export function formatApiRanks(ranks: RankApi[]): RankApi[] {
  return ranks.sort(sortRankApiByName)
}
