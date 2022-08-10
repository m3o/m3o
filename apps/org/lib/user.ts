import type { NextApiResponse, NextApiRequest } from 'next'
import type { Token } from 'types/user'
import { serializeCookie } from './cookie'
import { AuthCookieNames } from './constants'
import { createKey } from './api/m3o/services/v1-api'
import { getDeviceName } from '@/utils/device'

export async function setLoginCookies(
  req: NextApiRequest,
  res: NextApiResponse,
  token: Token,
) {
  const response = await createKey({
    description: `${getDeviceName(req.headers['user-agent'] || '')} Web Token`,
    scopes: [`*`],
    token: token.access_token,
  })

  res.setHeader('Set-Cookie', [
    serializeCookie(AuthCookieNames.Token, token.access_token),
    serializeCookie(AuthCookieNames.Namespace, 'micro'),
    serializeCookie(AuthCookieNames.Expiry, token.expiry),
    serializeCookie(AuthCookieNames.Refresh, token.refresh_token),
    serializeCookie(AuthCookieNames.ApiToken, response.api_key),
    serializeCookie(AuthCookieNames.ApiTokenId, response.api_key_id),
  ])
}
