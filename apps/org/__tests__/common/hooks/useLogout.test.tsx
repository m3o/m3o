import React, { FC } from 'react'
import { mocked } from 'jest-mock'
import { renderHook, act } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { logoutUser } from '@/lib/api/local/user'
import { useLogout } from '@/hooks'

jest.mock('@/lib/api/local/user')

const mockedLogoutUser = mocked(logoutUser, true)
const queryClient = new QueryClient()

const wrapper: FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

afterEach(jest.clearAllMocks)

describe('useLogout', () => {
  it('should call the the "logoutUser" promise', async () => {
    const { result } = renderHook(() => useLogout(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(mockedLogoutUser).toHaveBeenCalledTimes(1)
  })

  it('should set the href on the window.location to "/"', async () => {
    const { result } = renderHook(() => useLogout(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(window.location.href).toBe('http://localhost/')
  })
})
