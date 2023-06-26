import type { FC } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mocked } from 'jest-mock'
import { renderHook, act } from '@testing-library/react-hooks'
import { m3oInstance } from '@/lib/api/m3o/api'
import { BillingApiRoutes } from '@/lib/constants'
import { useDowngradeToFreeTier } from '../useDowngradeToFreeTier'
import { useM3OApi } from '../../m3o/useM3OApi'

jest.mock('../../m3o/useM3OApi')
jest.mock('@/lib/api/m3o/api')

const queryClient = new QueryClient()
const mockedM3OApi = mocked(useM3OApi, true)
const mockedM3OInstance = mocked(m3oInstance, true)

mockedM3OApi.mockImplementation(() => mockedM3OInstance)

const wrapper: FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useDowngradeToFreeTier', () => {
  it('should call post to the correct URL and payload', async () => {
    const { result } = renderHook(() => useDowngradeToFreeTier(), { wrapper })
    await act(async () => await result.current.downgrade())
    expect(mockedM3OInstance.post).toBeCalledWith(
      BillingApiRoutes.SubscribeTier,
      {
        id: 'free',
      },
    )
  })

  it('should call the passed "onSuccess" method when a successful call is made', async () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useDowngradeToFreeTier({ onSuccess }), {
      wrapper,
    })
    await act(async () => await result.current.downgrade())
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })
})
