import type { NextApiRequest, NextApiResponse } from 'next'
import type { VerifyEmailRequest } from 'm3o/user'
import type { M3ORequestError } from '@m3o/types'
import { user } from '../../user'
import { sendError } from '../../utils/errors'

enum M3OErrors {
  IncorrectVerifyToken = 'token not found'
}

export async function verify(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as VerifyEmailRequest

  if (!body.token) {
    sendError({
      res,
      message: 'Please provide the verification token',
      statusCode: 400
    })

    return
  }

  try {
    const response = await user.verifyEmail(body)
    console.log(response)
  } catch (e: any) {
    if (e.Id) {
      const error = e as M3ORequestError

      sendError({
        res,
        message:
          error.Detail === M3OErrors.IncorrectVerifyToken
            ? 'Please provide a valid verification token'
            : error.Detail,
        statusCode: error.Code
      })
    }
    console.log(e)
  }
}
