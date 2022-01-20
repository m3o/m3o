import type { Service, AppService } from 'm3o/app'
import { useQuery } from 'react-query'
import { useAppsInstance } from './useAppsInstance'

async function fetchApps(apps: AppService): Promise<Service[]> {
  const response = await apps.list({})
  return response.services || []
}

export function useListApps() {
  const apps = useAppsInstance()
  const { data = [], isLoading } = useQuery('apps', () => fetchApps(apps), {
    refetchInterval: 5000
  })

  return {
    apps: data,
    isLoading
  }
}
