import type { CallV1ApiPayload } from '../useCallV1Api'
import axios from 'axios'
import { mocked } from 'jest-mock'
import { callV1Api } from '../useCallV1Api'

jest.mock('axios')

const mockedAxios = mocked(axios, true)
const token = 'TOKEN_12345'

const testPayload: CallV1ApiPayload = {
  endpoint: 'test endpoint',
  json: {},
  service: 'testService',
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('useCallV1Api', () => {
  describe('callV1Api', () => {
    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        data: { answer: 'This is the answer' },
      })
    })

    it('should call the API with the correct URL, payload and headers', async () => {
      const expectedUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/${
        testPayload.service
      }/${testPayload.endpoint.replace(' ', '')}`

      await callV1Api(token, testPayload)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expectedUrl,
        testPayload.json,
        {
          headers: {
            'Micro-Namespace': 'micro',
            authorization: `Bearer ${token}`,
          },
        },
      )
    })
  })
})
