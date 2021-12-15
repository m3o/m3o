import type { NextApiRequest, NextApiResponse } from 'next'
import type { M3ORequestError } from '@m3o/types'
import { CONFIG } from '../../config'
import { sendError } from '../../utils/errors'
import { deleteCookie } from '../../utils/cookie'
import { readSession, getUserById } from '../utils'

export async function me(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { cookies } = req
  const sessionId = cookies[CONFIG.USER_COOKIE_NAME]

  if (!cookies[CONFIG.USER_COOKIE_NAME]) {
    sendError({ message: 'No token provided', res, statusCode: 401 })
    return
  }

  try {
    const session = await readSession(sessionId)
    const userResponse = await getUserById(session.userId!)

    res.json({
      account: userResponse.account
    })
  } catch (e) {
    if ((e as any).Id) {
      const error = e as M3ORequestError

      if (error.Code === 500 && error.Detail === 'not found') {
        deleteCookie(res, CONFIG.USER_COOKIE_NAME)
        return res.status(401).send({ error: { message: 'Token expired' } })
      }
    }
  }
}
