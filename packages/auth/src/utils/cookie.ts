import type { NextApiResponse } from 'next'
import cookie from 'cookie'

export function deleteCookie(res: NextApiResponse, cookieName: string) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(cookieName, '', {
      path: '/',
      sameSite: 'strict',
      expires: new Date(0)
    })
  )
}
