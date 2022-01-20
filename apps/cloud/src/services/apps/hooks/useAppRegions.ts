import type { AppService } from 'm3o/app'
import { useQuery } from 'react-query'
import { useAppsInstance } from './useAppsInstance'

interface UseAppRegions {
  regions: string[]
  isLoading: boolean
}

async function fetchRegions(apps: AppService): Promise<string[]> {
  const response = await apps.regions({})
  return response.regions || []
}

export function useAppRegions(): UseAppRegions {
  const apps = useAppsInstance()
  const { data = [], isLoading } = useQuery('app-regions', () =>
    fetchRegions(apps)
  )

  return { regions: data, isLoading }
}
