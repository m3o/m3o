import { returnLoginUrl } from '../auth'
import { URLS, LOGIN_URL } from '../../constants'

describe('Utils: auth', () => {
  describe('returnLoginUrl', () => {
    it('should return the url to redirect to when there is no cookie', () => {
      expect(returnLoginUrl()).toBe(`${URLS.test}${LOGIN_URL}`)
    })
  })
})
