import type { NextApiRequest, NextApiResponse } from 'next'
import type { SendPasswordResetEmailRequest } from 'm3o/user'
import type { HandleAuthOpts } from '../types'
import type { M3ORequestError } from '@m3o/types'
import { sendError } from '../../utils/errors'
import { user } from '../../user'

interface ExpectedRequestBody {
  email: string
}

const isNotFoundError = (str: string): boolean => str === 'not found'

export async function sendPasswordResetEmail(
  req: NextApiRequest,
  res: NextApiResponse,
  opts: HandleAuthOpts = {}
) {
  const { sendPasswordResetEmailOpts = {}, websiteName = 'Your Website' } = opts
  const { email } = req.body as ExpectedRequestBody

  if (!email) {
    sendError({
      res,
      message: 'Please provide an email address',
      statusCode: 400
    })

    return
  }

  const payload: SendPasswordResetEmailRequest = {
    email,
    fromName: sendPasswordResetEmailOpts.fromName || websiteName,
    subject: sendPasswordResetEmailOpts.subject || 'Password reset code',
    textContent:
      sendPasswordResetEmailOpts.textContent ||
      `Hi there,\n click here to reset your password: http://${req.headers.host}/reset-password/code?=$code`
  }

  try {
    await user.sendPasswordResetEmail(payload)
    res.json({})
  } catch (e: any) {
    if (e.Id) {
      const error = e as M3ORequestError

      const statusCode: number = isNotFoundError(error.Detail)
        ? 400
        : error.Code

      const message: string = isNotFoundError(error.Detail)
        ? 'User with email was found'
        : error.Detail

      sendError({ res, message, statusCode })
    }
  }
}
