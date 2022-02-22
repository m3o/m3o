import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { areEqualStringArrays } from '@/utils/helpers'

export function useUpdateSearchUrl(
  searchTerm: string,
  selectedCategories: string[],
) {
  const previousSearchTerm = useRef(searchTerm)
  const previousSelectedCategory = useRef(selectedCategories)
  const router = useRouter()

  useEffect(() => {
    if (
      previousSearchTerm.current !== searchTerm ||
      !areEqualStringArrays(
        previousSelectedCategory.current,
        selectedCategories,
      )
    ) {
      previousSearchTerm.current = searchTerm
      previousSelectedCategory.current = selectedCategories

      router.replace(router.pathname, {
        query: {
          search: searchTerm,
          categories: selectedCategories.join(','),
        },
      })
    }
  }, [searchTerm, selectedCategories, router])
}
