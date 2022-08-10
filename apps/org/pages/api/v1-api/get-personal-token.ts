import type { NextApiRequest, NextApiResponse } from 'next'
import { AuthCookieNames } from '@/lib/constants'
import { createKey } from '@/lib/api/m3o/services/v1-api'
import { getDeviceName } from '@/utils/device'
import { serializeCookie } from '@/lib/cookie'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.cookies[AuthCookieNames.ApiToken]) {
    res.send({ token: req.cookies[AuthCookieNames.ApiToken] })
    return
  }

  try {
    const response = await createKey({
      description: `${getDeviceName(
        req.headers['user-agent'] || '',
      )} Web Token`,
      scopes: [`*`],
      token: req.cookies[AuthCookieNames.Token],
    })

    res.setHeader('Set-Cookie', [
      serializeCookie(AuthCookieNames.ApiToken, response.api_key),
      serializeCookie(AuthCookieNames.ApiTokenId, response.api_key_id),
    ])

    res.send({ token: response.api_key })
  } catch (e) {
    const error = e as ApiError
    res.status(error.code || 500).send(error)
  }
}
