import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'm3o/user'
import type { M3ORequestError } from '@m3o/types'
import cookie, { CookieSerializeOptions } from 'cookie'
import { user } from '../../user'
import { sendError } from '../../utils/errors'
import { isM3ORequestError } from '../../utils/errors'
import { CONFIG } from '../../config'

type LoginError = string | M3ORequestError

interface ErrorMessagesDictionary {
  [key: string]: string
}

function getUserById(userId: string) {
  return user.read({
    id: userId
  })
}

const ErrorMessages: ErrorMessagesDictionary = {
  'crypto/bcrypt: hashedPassword is not the hash of the given password':
    'Incorrect password',
  'not found': "We're, unable to find a login with this email address"
}

function handleLoginError(e: LoginError, res: NextApiResponse) {
  if (isM3ORequestError(e)) {
    const message = ErrorMessages[e.Detail]
    sendError({ res, message, statusCode: e.Code })
    return
  }
}

export async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const loginResponse = await user.login(req.body)
    const session = loginResponse.session as Session
    const readUserResponse = await getUserById(session.userId!)

    const cookieOpts: CookieSerializeOptions = {
      expires: new Date(session.expires! * 1000),
      path: '/',
      sameSite: 'strict'
    }

    res.setHeader('Set-Cookie', [
      cookie.serialize(CONFIG.USER_COOKIE_NAME, session.id!, cookieOpts)
    ])

    res.json({
      account: readUserResponse.account
    })
  } catch (e) {
    const error = e as LoginError
    handleLoginError(error, res)
  }
}
