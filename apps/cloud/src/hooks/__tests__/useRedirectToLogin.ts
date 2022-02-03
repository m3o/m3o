import { renderHook } from '@testing-library/react-hooks'
import { useRedirectToLogin } from '../useRedirectToLogin'
import { returnLoginUrl } from '../../utils/auth'
import { MICRO_API_TOKEN_COOKIE_NAME } from '../../constants'

afterEach(() => {
  window.location.href = ''
})

describe('useRedirectToLogin', () => {
  describe('when the cookie has not been set', () => {
    it('should set "window.location.href" to the correct url when not logged in', () => {
      renderHook(() => useRedirectToLogin())
      expect(window.location.href.trim()).toBe(returnLoginUrl())
    })

    it('should not set authenticated to true', () => {
      const { result } = renderHook(() => useRedirectToLogin())
      expect(result.current.authenticated).toBe(false)
    })
  })

  describe('when the cookie has been set', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: `${MICRO_API_TOKEN_COOKIE_NAME}=1234`
      })
    })

    it('set authenticated to true when the cookie has been found', () => {
      const { result } = renderHook(() => useRedirectToLogin())
      expect(result.current.authenticated).toBe(true)
    })
  })
})
