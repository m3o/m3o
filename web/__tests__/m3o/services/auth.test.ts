import { mocked } from 'jest-mock'
import { inspectUser, UserEndpoints } from '@/lib/api/m3o/services/auth'
import { m3oInstance } from '@/lib/api/m3o/api'
import accountFixture from '@/lib/fixtures/user/account-fixture.json'

jest.mock('@/lib/api/m3o/api')

const mockedM3oInstance = mocked(m3oInstance, true)
const token = '1234'
const namespace = 'micro'

afterEach(jest.clearAllMocks)

describe('m3o service: auth', () => {
  describe('inspectUser', () => {
    beforeEach(() => {
      mockedM3oInstance.post.mockResolvedValue({
        data: { account: accountFixture },
      })
    })

    it('should call the correct endpoint with the correct payload', async () => {
      await inspectUser({
        microToken: token,
        namespace,
      })

      expect(mockedM3oInstance.post).toHaveBeenCalledWith(
        UserEndpoints.Inspect,
        {
          token,
          options: {
            namespace,
          },
        },
      )
    })

    it('should return the correct response', async () => {
      const response = await inspectUser({
        microToken: token,
        namespace,
      })

      expect(response).toEqual({ account: accountFixture })
    })
  })
})
