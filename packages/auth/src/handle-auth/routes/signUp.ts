import type { NextApiRequest, NextApiResponse } from 'next'
import type { CreateRequest } from 'm3o/user'
import type { M3ORequestError } from '@m3o/types'
import { sendError } from '../../utils/errors'
import { user } from '../../user'

function addEmailOrUsernameIfNonExists(
  requestPayload: CreateRequest
): CreateRequest {
  const newPayload = { ...requestPayload }

  if (!newPayload.username) {
    newPayload.username = newPayload.email
  }

  if (!newPayload.email) {
    newPayload.email = newPayload.username
  }

  return newPayload
}

export async function signUp(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body.email && !req.body.username) {
    sendError({
      message: 'Please provide an email or username',
      res,
      statusCode: 400
    })

    return
  }

  const payload = addEmailOrUsernameIfNonExists(req.body)

  try {
    await user.create(payload)
    res.json({})
  } catch (e) {
    const error = e as M3ORequestError
    sendError({ message: error.Detail, res, statusCode: error.Code })
  }
}
