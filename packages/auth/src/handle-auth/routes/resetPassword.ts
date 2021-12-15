import type { NextApiRequest, NextApiResponse } from 'next'
import type { M3ORequestError } from '@m3o/types'
import type { ResetPasswordRequest } from 'm3o/user'
import { sendError } from '../../utils/errors'
import { user } from '../../user'

export async function resetPassword(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as ResetPasswordRequest

  if (!body.code) {
    sendError({
      message: 'No code provided from email',
      res,
      statusCode: 400
    })

    return
  }

  if (body.newPassword !== body.confirmPassword) {
    sendError({
      message: 'The new password and confirm password do not match',
      res,
      statusCode: 400
    })

    return
  }

  try {
    await user.resetPassword(body)
    res.json({})
  } catch (e: any) {
    if (e.Id) {
      const error = e as M3ORequestError

      sendError({
        message: error.Detail,
        statusCode:
          error.Detail === 'password reset code not found' ? 404 : error.Code,
        res
      })
    }
  }
}
