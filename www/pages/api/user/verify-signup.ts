import type { NextApiRequest, NextApiResponse } from 'next'
import type { AxiosError } from 'axios'
import { AuthCookieNames, TrackingCookieNames } from '@/lib/constants'
import { track } from '@/lib/api/m3o/services/tracking'
import { m3oInstance } from '@/lib/api/m3o/api'
import { serializeCookie } from '@/lib/cookie'

interface VerifySignUpResponse {
  authToken: Token
  namespace: string
  is_signup: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const registrationDate = Math.floor(Date.now() / 1000)
  const trackingId = req.cookies[TrackingCookieNames.TrackingId]

  try {
    const {
      data: { authToken },
    } = await m3oInstance.post<VerifySignUpResponse>(
      '/onboarding/signup/CompleteSignup',
      req.body,
    )

    res.setHeader('Set-Cookie', [
      serializeCookie(AuthCookieNames.Token, authToken.access_token),
      serializeCookie(AuthCookieNames.Namespace, 'micro'),
      serializeCookie(AuthCookieNames.Expiry, authToken.expiry),
      serializeCookie(AuthCookieNames.Refresh, authToken.refresh_token),
    ])

    await track({ id: trackingId, registration: registrationDate })

    res.end()
  } catch (e) {
    const error = e as AxiosError
    res.status(error.response?.data.Code).send(error.response?.data)
  }
}
