import type { FC } from 'react'
import { useRecentlyViewed } from '@/hooks'
import { Spinner, RecentlyViewedService } from '@/components/ui'

function renderRecentlyViewed(recentlyViewedApis: ExploreAPI[]) {
  if (recentlyViewedApis.length === 0) {
    return (
      <p className="text-zinc-400">
        You haven&apos;t viewed any of our APIs yet
      </p>
    )
  }

  return recentlyViewedApis.map(item => (
    <RecentlyViewedService key={item.name} {...item} />
  ))
}

export const RecentlyViewed: FC = () => {
  const { recentlyViewedApis, isLoading } = useRecentlyViewed()

  return (
    <div className="mt-10 text-white">
      <h5 className="font-bold text-xl mb-4">Recently Viewed</h5>
      {isLoading ? <Spinner /> : renderRecentlyViewed(recentlyViewedApis)}
    </div>
  )
}
