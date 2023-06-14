import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { m3o } from '../../lib/m3o'
import type { M3OError } from '../../types/m3o'
import type { LoginFields } from '../../types/user'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const _body = req.body as LoginFields

    try {
        // Login the user
        const { session } = await m3o.user.login({
            email: _body.email,
            password: _body.password,
        })

        // Get the users details
        const user = await m3o.user.read({
            id: session.userId,
        })

        // Set the session in the cookie
        const cookie = serialize('session', session.id, {
            httpOnly: true,
            path: '/',
        })

        res.setHeader('Set-Cookie', cookie)

        res.send({
            user: user.account!,
        })
    } catch (error) {
        console.log('[USER LOGIN]: Error')
        const _error = error as M3OError

        res.status(_error.code).send({
            message: _error.detail,
        })
    }
}
