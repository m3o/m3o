import type { VerifySignUpPayload } from '@/types'
import { mocked } from 'jest-mock'
import {
  logoutUser,
  UserEndpoints,
  loginUser,
  LoginUserPayload,
  sendVerificationEmail,
  SendVerificationEmailPayload,
} from '@/lib/api/local/user'
import { apiInstance } from '@/lib/api/local/api'

jest.mock('@/lib/api/local/api')

const mockedApiInstance = mocked(apiInstance, true)

afterEach(jest.clearAllMocks)

describe('Local API: User service', () => {
  describe('logoutUser', () => {
    it('should call the correct endpoint when logging out the user', async () => {
      await logoutUser()
      expect(mockedApiInstance.post).toHaveBeenCalledWith(UserEndpoints.Logout)
    })
  })

  describe('loginUser', () => {
    it('should call the correct endpoint and payload when logging in the user', async () => {
      const payload: LoginUserPayload = {
        email: 'darthvader@deathstar.com',
        password: 'iamyourfather',
      }

      await loginUser(payload)

      expect(mockedApiInstance.post).toHaveBeenCalledWith(
        UserEndpoints.Login,
        payload,
      )
    })
  })

  describe('sendVerificationEmail', () => {
    it('should call the correct endpoint', async () => {
      const payload: SendVerificationEmailPayload = {
        email: 'darthvader@deathstar.com',
      }

      await sendVerificationEmail(payload)

      expect(mockedApiInstance.post).toHaveBeenCalledWith(
        UserEndpoints.SendVerificationEmail,
        payload,
      )
    })
  })
})
