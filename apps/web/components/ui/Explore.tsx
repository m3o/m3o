import type { FC, ReactElement, FormEvent } from 'react'
import { useState, useCallback } from 'react'
import { searchServices } from '@/lib/api/m3o/services/explore'
import {
  CategoriesFilter,
  ExploreSearch,
  ExploreResults,
  MobileFilters,
} from '@/components/pages/Explore'
import { fetchCategories } from '@/lib/api/m3o/services/explore'
import { withAuth } from '@/lib/api/m3o/withAuth'

export interface ExploreProps {
  route: string
  categories: string[]
  header: ReactElement
  initialSearchTerm: string
  services: ExploreAPI[]
}

export const exploreGetServerSideProps = withAuth(async context => {
  const categories = await fetchCategories()
  const services = await searchServices(context.query.search as string, [])

  return {
    props: {
      route: '/explore',
      categories,
      initialSearchTerm: context.query.search || '',
      services,
      user: context.req.user,
    } as Omit<ExploreProps, 'header'>,
  }
})

export const Explore: FC<ExploreProps> = ({
  route,
  categories,
  header,
  services,
  initialSearchTerm,
}: ExploreProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleCategoryClick = useCallback(() => {
    setShowMobileMenu(() => false)
  }, [])

  const categoriesItems = (
    <CategoriesFilter
      route={route}
      categories={categories}
      onCategoryClick={handleCategoryClick}
    />
  )

  const handleSearch = useCallback((event: FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    window.location.href = `${route}?search=${formData.get('search') as string}`
  }, [])

  return (
    <>
      <header className="py-10 px-4 md:pt-16 md:pb-0 dark:bg-zinc-900">
        <div className="m3o-container sm md:flex justify-between">
          {header}
          <div className="mt-4 md:mt-0">
            <ExploreSearch
              handleSubmit={handleSearch}
              initialSearchTerm={initialSearchTerm}
            />
          </div>
        </div>
      </header>
      <div className="bg-zinc-50 md:pt-8 md:pb-8 dark:bg-zinc-900">
        <div className="m3o-container sm">
          <div className="md:grid md:grid-cols-5 gap-10 dark:text-white">
            <aside className="hidden md:block">{categoriesItems}</aside>
            <div className="col-span-4 pb-6">
              <ExploreResults services={services} />
            </div>
          </div>
        </div>
      </div>
      <MobileFilters
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}>
        {categoriesItems}
      </MobileFilters>
    </>
  )
}
