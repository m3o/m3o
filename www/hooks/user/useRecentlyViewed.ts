import { useEffect, useState, useCallback, useMemo } from 'react'
import { localStorage } from '@/utils/storage'
import { RECENTLY_VIEWED_KEY } from '@/lib/constants'
import { useListApis } from '../explore/useListApis'

interface UseRecentlyViewed {
  addApiToRecentlyViewed: (apiName: string) => void
  isLoading: boolean
  recentlyViewedKeys: string[]
  recentlyViewedApis: ExploreAPI[]
}

export function useRecentlyViewed(): UseRecentlyViewed {
  const apis = useListApis()
  const [recentlyViewedKeys, setRecentlyViewedKeys] = useState<string[]>([])

  const addApiToRecentlyViewed = useCallback((apiName: string) => {
    setRecentlyViewedKeys(prevItems => {
      const removedFromPrevious = prevItems.filter(item => item !== apiName)
      const newItems = [apiName, ...removedFromPrevious]
      return newItems.slice(0, 3)
    })
  }, [])

  // Initially set the keys on load
  useEffect(() => {
    const storageItem = localStorage.getItem(RECENTLY_VIEWED_KEY)
    setRecentlyViewedKeys(storageItem ? JSON.parse(storageItem) : [])
  }, [])

  // Update the local storage value
  useEffect(() => {
    localStorage.setItem(
      RECENTLY_VIEWED_KEY,
      JSON.stringify(recentlyViewedKeys),
    )
  }, [recentlyViewedKeys])

  const recentlyViewedApis = useMemo(() => {
    if (apis.isLoading || !apis.data) {
      return []
    }

    return recentlyViewedKeys.map(
      name => apis.data.find(api => api.name === name)!,
    )
  }, [apis.isLoading, apis.data, recentlyViewedKeys])

  return {
    addApiToRecentlyViewed,
    isLoading: apis.isLoading,
    recentlyViewedKeys,
    recentlyViewedApis,
  }
}
