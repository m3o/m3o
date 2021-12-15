import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'
import { sendError } from '../../utils/errors'
import { user } from '../../user'
import { CONFIG } from '../../config'

export async function logoutUser(req: NextApiRequest, res: NextApiResponse) {
  const { cookies } = req
  const sessionId: string | undefined = cookies[CONFIG.USER_COOKIE_NAME]

  if (!sessionId) {
    sendError({ message: 'No token provided', res, statusCode: 401 })
    return
  }

  try {
    await user.logout({ sessionId })

    res.setHeader('Set-Cookie', [
      cookie.serialize(CONFIG.USER_COOKIE_NAME, '', {
        path: '/',
        sameSite: 'strict',
        expires: new Date(0)
      })
    ])

    res.json({})
  } catch (e) {
    sendError({ message: 'Server error', res, statusCode: 500 })
  }
}
