import { useQuery } from 'react-query'
import { fetchRelatedApis } from '@/lib/api/m3o/services/explore'

export function useGetRelatedApis(apiName: string, category: string) {
  return useQuery(['related-items', apiName], () => fetchRelatedApis(category))
}
