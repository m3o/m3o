import type { Service } from 'm3o/app'
import { useQuery } from 'react-query'
import { apps } from '../apps.service'

async function fetchApps(): Promise<Service[]> {
  const response = await apps.list({})
  return response.services || []
}

export function useListApps() {
  const { data = [], isLoading } = useQuery('apps', fetchApps, {
    refetchInterval: 5000
  })

  return {
    apps: data,
    isLoading
  }
}
