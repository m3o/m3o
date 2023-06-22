import { NextApiRequest, NextApiResponse } from 'next'
import type { UserAccount } from '../types/user'
import { m3o } from './m3o'

/* eslint-disable no-unused-vars */
type Callback = (
    req: NextApiRequest,
    res: NextApiResponse,
    user: UserAccount,
    sessionId: string
) => void
/* eslint-enable */

const sendUnauthorized = (res: NextApiResponse) =>
    res.status(401).send({
        message: 'Unauthorized',
    })

export function authenticatedHandler(cb: Callback) {
    return async function handler(req: NextApiRequest, res: NextApiResponse) {
        if (!req.cookies.session) {
            sendUnauthorized(res)
            return
        }

        try {
            const { session } = await m3o.user.readSession({
                session_id: req.cookies.session,
            })

            const { account } = await m3o.user.read({
                id: session.userId,
            })

            return cb(req, res, account as UserAccount, req.cookies.session)
        } catch (error) {
            sendUnauthorized(res)
        }
    }
}
