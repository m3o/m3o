import type { FC, ReactElement } from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Spinner } from '@/components/ui'
import { searchServices } from '@/lib/api/m3o/services/explore'
import {
  CategoriesFilter,
  ExploreSearch,
  ExploreResults,
  MobileFilters,
} from '@/components/pages/Explore'
import { useDebounce, useUpdateSearchUrl } from '@/hooks'
import { fetchCategories } from '@/lib/api/m3o/services/explore'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { FiltersButton, ShowHideResultsButton } from './Buttons'

export interface ExploreProps {
  categories: string[]
  header: ReactElement
  initialSearchTerm: string
  initialCategories: string[]
  services: ExploreAPI[]
}

export const exploreGetServerSideProps = withAuth(async context => {
  const selectedCategories = ((context.query.categories as string) || '')
    .split(',')
    .filter(item => !!item)

  const categories = await fetchCategories()
  const services = await searchServices(
    context.query.search as string,
    selectedCategories,
  )

  return {
    props: {
      categories: categories.sort(),
      initialCategories: selectedCategories,
      initialSearchTerm: context.query.search || '',
      services,
      user: context.req.user,
    } as Omit<ExploreProps, 'header'>,
  }
})

export const Explore: FC<ExploreProps> = ({
  categories,
  header,
  services,
  initialCategories,
  initialSearchTerm,
}: ExploreProps) => {
  const [shouldShowMore, setShouldShowMore] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [updatedSearchText, setUpdatedSearchTerm] = useState(initialSearchTerm)
  const debouncedValue = useDebounce<string>(updatedSearchText, 400)
  const [selectedCategories, setSelectedCategories] =
    useState(initialCategories)
  const categoriesLength = selectedCategories.length

  useUpdateSearchUrl(searchTerm, selectedCategories)

  const { data = [], isFetching } = useQuery(
    ['explore', searchTerm, selectedCategories],
    () => searchServices(searchTerm, selectedCategories),
    {
      initialData: services,
    },
  )

  const onCheckboxSelect = useCallback((category: string) => {
    setShowMobileMenu(false)

    setSelectedCategories(prevSelected =>
      prevSelected.includes(category)
        ? prevSelected.filter(item => item !== category)
        : [...prevSelected, category],
    )
  }, [])

  const onClearAllClick = useCallback(() => {
    setShowMobileMenu(false)
    setSelectedCategories([])
  }, [])

  useEffect(() => {
    setSearchTerm(debouncedValue)
  }, [debouncedValue])

  return (
    <>
      <header className="py-10 px-4 md:py-12 border-b dark:border-zinc-800 border-zinc-200">
        <div className="m3o-container sm">
          {header}
          <div className="mt-4 md:mt-8">
            <ExploreSearch
              handleChange={event => {
                setUpdatedSearchTerm(event.target.value)
              }}
              value={updatedSearchText}
            />
          </div>
        </div>
      </header>
      <div className="bg-zinc-50 pt-20 dark:bg-zinc-900">
        <div className="m3o-container sm">
          <div className="md:grid md:grid-cols-5">
            {/*
            <aside className="hidden md:block">
              <CategoriesFilter
                categories={categories}
                onClearAllClick={onClearAllClick}
                handleCategoryChange={onCheckboxSelect}
                selectedCategories={selectedCategories}
              />
            </aside>
            */}
            <div className="col-span-6 pb-6">
              {isFetching ? (
                <div className="flex justify-center w-full">
                  <Spinner className="scale-125 transform" />
                </div>
              ) : (
                <>
                  <ExploreResults
                    services={shouldShowMore ? data : data.slice(0, 9)}
                  />
                  {data.length > 9 && (
                    <ShowHideResultsButton
                      onClick={() => setShouldShowMore(prev => !prev)}
                      shouldShowMore={shouldShowMore}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/*
      <FiltersButton
        onClick={() => setShowMobileMenu(true)}
        selectedCategoriesLength={categoriesLength}
      />
      <MobileFilters
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}>
        <CategoriesFilter
          categories={categories}
          handleCategoryChange={onCheckboxSelect}
          onClearAllClick={onClearAllClick}
          selectedCategories={selectedCategories}
        />
      </MobileFilters>
      */}
    </>
  )
}
