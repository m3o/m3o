import { useQuery } from 'react-query'
import { functions } from '../functions.service'

interface UseFunctionRuntimes {
  runtimes: string[]
  loadingRuntimes: boolean
}

async function fetchRuntimes(): Promise<string[]> {
  const response = await functions.runtimes({})
  return response.runtimes || []
}

export function useFunctionRuntimes(): UseFunctionRuntimes {
  const { data = [], isLoading } = useQuery('function-runtimes', fetchRuntimes)
  return { runtimes: data, loadingRuntimes: isLoading }
}
