import React, { FC } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { renderHook, act } from '@testing-library/react-hooks'
import { useRecentlyViewed } from '@/hooks'
import { RECENTLY_VIEWED_KEY } from '@/lib/constants'
import servicesFixture from '@/lib/fixtures/apis/services-fixtures.json'

const queryClient = new QueryClient()

queryClient.setQueryData('services', servicesFixture)

const wrapper: FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const [firstService, secondService, thirdService, fourthService] =
  servicesFixture

afterEach(() => {
  jest.clearAllMocks()
  localStorage.removeItem(RECENTLY_VIEWED_KEY)
})

describe('useRecentlyViewed', () => {
  it('should add an item to the recently viewed array', () => {
    const { result } = renderHook(() => useRecentlyViewed(), { wrapper })

    act(() => {
      result.current.addApiToRecentlyViewed(firstService.name)
    })

    expect(result.current.recentlyViewedApis).toEqual([firstService])
    expect(result.current.recentlyViewedKeys).toEqual([firstService.name])
  })

  it('should add another item to the array but before the previous', () => {
    const { result } = renderHook(() => useRecentlyViewed(), { wrapper })

    act(() => {
      result.current.addApiToRecentlyViewed(firstService.name)
      result.current.addApiToRecentlyViewed(secondService.name)
    })

    expect(result.current.recentlyViewedApis).toEqual([
      secondService,
      firstService,
    ])

    expect(result.current.recentlyViewedKeys).toEqual([
      secondService.name,
      firstService.name,
    ])
  })

  it('should limit the results to three and put in the most recent order', () => {
    const { result } = renderHook(() => useRecentlyViewed(), { wrapper })

    act(() => {
      result.current.addApiToRecentlyViewed(firstService.name)
      result.current.addApiToRecentlyViewed(secondService.name)
      result.current.addApiToRecentlyViewed(thirdService.name)
      result.current.addApiToRecentlyViewed(fourthService.name)
    })

    expect(result.current.recentlyViewedApis).toEqual([
      fourthService,
      thirdService,
      secondService,
    ])

    expect(result.current.recentlyViewedKeys).toEqual([
      fourthService.name,
      thirdService.name,
      secondService.name,
    ])
  })
})
