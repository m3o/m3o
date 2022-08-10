import type { NextApiRequest, NextApiResponse } from 'next'
import type { AxiosError } from 'axios'
import addYears from 'date-fns/addYears'
import { TrackingCookieNames } from '@/lib/constants'
import { track } from '@/lib/api/m3o/services/tracking'
import { sendVerificationEmail } from '@/lib/api/m3o/services/auth'
import { serializeCookie } from '@/lib/cookie'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { cookies } = req
    const firstVerificationCookie =
      cookies[TrackingCookieNames.FirstVerification]

    if (!firstVerificationCookie) {
      const firstVerificationDate = Math.floor(Date.now() / 1000)
      const trackingId = cookies[TrackingCookieNames.TrackingId]

      res.setHeader(
        'Set-Cookie',
        serializeCookie(
          TrackingCookieNames.FirstVerification,
          firstVerificationDate.toString(),
          addYears(new Date(), 1),
        ),
      )

      await track({
        id: trackingId,
        firstVerification: firstVerificationDate,
        email: req.body.email,
      })
    }

    await sendVerificationEmail({
      email: req.body.email,
    })

    res.end()
  } catch (e) {
    const error = e as AxiosError
    const data = error.response?.data as ApiError
    res.status(data.code).send(data)
  }
}
