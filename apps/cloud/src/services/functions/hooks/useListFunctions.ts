import type { Func } from 'm3o/function'
import { useQuery } from 'react-query'
import { functions } from '../functions.service'

async function fetchFunctions(): Promise<Func[]> {
  const response = await functions.list({})
  return response.functions || []
}

export function useListFunctions() {
  const { data = [], isLoading } = useQuery('functions', fetchFunctions, {
    refetchInterval: 5000
  })

  return {
    functions: data,
    isLoading
  }
}
