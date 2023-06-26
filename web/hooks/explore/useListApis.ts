import { useQuery } from 'react-query'
import { exploreServices } from '@/lib/api/m3o/services/explore'

export function useListApis() {
  return useQuery('services', () => exploreServices())
}
