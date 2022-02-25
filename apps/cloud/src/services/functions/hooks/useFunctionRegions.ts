import { useQuery } from 'react-query'
import { functions } from '../functions.service'

interface UseFunctionRegions {
  regions: string[]
  isLoading: boolean
}

async function fetchRegions(): Promise<string[]> {
  const response = await functions.regions({})
  return response.regions || []
}

export function useFunctionRegions(): UseFunctionRegions {
  const { data = [], isLoading } = useQuery('function-regions', fetchRegions)
  return { regions: data, isLoading }
}
