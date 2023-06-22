import { serialize } from 'cookie'
import { authenticatedHandler } from '@/lib/authentication'
import { m3o } from '@/lib/m3o'

export default authenticatedHandler(async function handler(
    req,
    res,
    _,
    sessionId
) {
    console.log()
    try {
        await m3o.user.logout({ session_id: sessionId })

        res.setHeader(
            'Set-Cookie',
            serialize('session', '', { maxAge: -1, path: '/' })
        )

        res.json({})
    } catch (error) {
        res.status(500).json({
            message: 'INTERNAL_SERVER_ERROR',
        })
    }
})
