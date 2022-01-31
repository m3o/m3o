import { useQuery } from 'react-query'
import { apps } from '../apps.service'

interface UseAppRegions {
  regions: string[]
  isLoading: boolean
}

async function fetchRegions(): Promise<string[]> {
  const response = await apps.regions({})
  return response.regions || []
}

export function useAppRegions(): UseAppRegions {
  const { data = [], isLoading } = useQuery('app-regions', fetchRegions)
  return { regions: data, isLoading }
}
