import type { FC } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mocked } from 'jest-mock'
import { renderHook, act } from '@testing-library/react-hooks'
import { BillingApiRoutes } from '@/lib/constants'
import { m3oInstance } from '@/lib/api/m3o/api'
import { useSubscribeToProTier } from '../useSubscribeToProTier'
import { useM3OApi } from '../../m3o/useM3OApi'

jest.mock('../../m3o/useM3OApi')
jest.mock('@/lib/api/m3o/api')

const queryClient = new QueryClient()
const mockedM3OApi = mocked(useM3OApi, true)
const mockedM3OInstance = mocked(m3oInstance, true)
const CARD_ID = 'card_1234'

mockedM3OApi.mockImplementation(() => mockedM3OInstance)

const wrapper: FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useSubscribeToProTier', () => {
  it('should call post to the correct URL and payload', async () => {
    const { result } = renderHook(() => useSubscribeToProTier(), { wrapper })
    await act(async () => await result.current.subscribe(CARD_ID))

    expect(mockedM3OInstance.post).toBeCalledWith(
      BillingApiRoutes.SubscribeTier,
      {
        id: 'pro',
        card_id: CARD_ID,
      },
    )
  })

  it('should call the passed "onSuccess" method when a successful call is made', async () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useSubscribeToProTier({ onSuccess }), {
      wrapper,
    })
    await act(async () => await result.current.subscribe(CARD_ID))
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })
})
