import type { FC } from 'react'
import { ServicesGrid } from '@/components/ui'

interface RelatedItemsProps {
  isLoading: boolean
  items: ExploreAPI[]
  apiDisplayName: string
}

export const RelatedItems: FC<RelatedItemsProps> = ({
  items,
  apiDisplayName,
}) => {
  const removeItemWithSameDisplayName = items.filter(
    item => item.display_name !== apiDisplayName,
  )

  if (removeItemWithSameDisplayName.length === 0) {
    return null
  }

  return (
    <section className="pb-6 border-t border-zinc-300 dark:border-zinc-600 pt-6 dark:bg-zinc-900">
      <div className="m3o-container">
        <h1 className="font-bold text-2xl md:text-3xl text-black dark:text-white mb-2">
          More APIs
        </h1>
        <h2 className="text-xl text-zinc-500 mb-4 dark:text-zinc-300">
          See APIs similar to {apiDisplayName}
        </h2>
        <ServicesGrid services={removeItemWithSameDisplayName} />
      </div>
    </section>
  )
}
