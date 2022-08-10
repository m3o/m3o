import type { AxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import cookie, { CookieSerializeOptions } from 'cookie'
import { logout } from '@/lib/api/m3o/services/auth'
import { AuthCookieNames } from '@/lib/constants'
import { serializeCookie } from '@/lib/cookie'
import { m3oInstance } from '@/lib/api/m3o/api'

async function handleLogout(req: NextApiRequest, res: NextApiResponse) {
  const values = Object.values(AuthCookieNames)
  let cookies: string[] = []

  values.forEach(cookieName => {
    const opts: CookieSerializeOptions = {
      path: '/',
      expires: new Date(0),
    }

    cookies = [
      ...cookies,
      cookie.serialize(cookieName, '', opts),
      serializeCookie(cookieName, '', new Date(0)),
    ]
  })

  await logout(req.cookies[AuthCookieNames.Token])

  res.setHeader('Set-Cookie', cookies)
  res.json({})
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const hasApiCookie = !!req.cookies[AuthCookieNames.ApiToken]

    if (hasApiCookie) {
      await m3oInstance.post(
        '/v1/api/keys/revoke',
        {
          id: req.cookies[AuthCookieNames.ApiTokenId],
        },
        {
          headers: {
            Authorization: `Bearer ${req.cookies[AuthCookieNames.Token]}`,
            'Micro-Namespace': 'micro',
          },
        },
      )
    }

    handleLogout(req, res)
  } catch (e) {
    const error = e as AxiosError
    const data = error.response?.data as ApiError

    if (data.id === 'v1.Revoke' && data.code === 404) {
      // Handle logout anyway...
      handleLogout(req, res)
    } else {
      res.status(data.code || 500).json(data)
    }
  }
}
