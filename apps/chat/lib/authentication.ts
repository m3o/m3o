import type { NextApiRequest, NextApiResponse } from 'next'
import call from './micro'
import tokenFromReq from './token'

type AuthenticatedRouteRequest = NextApiRequest & {}
type Callback = (req: AuthenticatedRouteRequest, res: NextApiResponse) => void

export async function authenticatedRoute(cb: Callback) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const token = tokenFromReq(req)

        if (!token) {
            res.status(401).json({ error: 'No token cookie set' })
            return
        }

        try {
            const response = await call('/users/validate', { token })
            console.log(response)
            cb(req, res)
        } catch ({ error, code }) {
            const statusCode = code === 400 ? 401 : code
            res.status(statusCode).json({ error })
            return
        }
    }
}
