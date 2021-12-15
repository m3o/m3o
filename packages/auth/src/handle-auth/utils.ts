import type { NextApiRequest } from 'next'
import type { Session, ReadResponse, Account } from 'm3o/user'
import { user } from '../user'
import { CONFIG } from '../config'

export async function readSession(sessionId: string): Promise<Session> {
  const readSessionResponse = await user.readSession({
    sessionId
  })

  return readSessionResponse.session as Session
}

export function getUserById(userId: string): Promise<ReadResponse> {
  return user.read({
    id: userId
  })
}

export async function getLoggedInUserAccount(
  req: NextApiRequest
): Promise<Account> {
  const { cookies, headers } = req
  const sessionId = cookies[CONFIG.USER_COOKIE_NAME] || headers.cookie

  if (!sessionId) {
    throw 'No session id found'
  }

  try {
    const { userId } = await readSession(sessionId)
    const { account } = await getUserById(userId!)
    return account as Account
  } catch (e) {
    throw e
  }
}
