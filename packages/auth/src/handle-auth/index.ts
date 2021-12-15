import type { NextApiRequest, NextApiResponse } from 'next'
import type { HandleAuthOpts } from './types'
import { sendError } from '../utils/errors'
import { loginUser } from './routes/login'
import { signUp } from './routes/signUp'
import { me } from './routes/me'
import { logoutUser } from './routes/logoutUser'
import { resetPassword } from './routes/resetPassword'
import { sendPasswordResetEmail } from './routes/sendPasswordResetEmail'

enum Methods {
  Get = 'GET',
  Post = 'POST'
}

const HANDLERS = {
  [`${Methods.Post} login`]: loginUser,
  [`${Methods.Post} logout`]: logoutUser,
  [`${Methods.Post} sign-up`]: signUp,
  [`${Methods.Get} me`]: me,
  [`${Methods.Post} reset-password`]: resetPassword,
  [`${Methods.Post} send-password-reset-email`]: sendPasswordResetEmail
}

export function handleAuth(opts: HandleAuthOpts = {}) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req
    const [route] = query.m3oUser as string[]

    const handler = HANDLERS[`${method} ${route}`]

    if (!handler) {
      return sendError({ message: 'Method not allowed', res, statusCode: 405 })
    }

    return handler(req, res, opts)
  }
}
