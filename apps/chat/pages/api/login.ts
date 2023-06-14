import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import call from '../../lib/micro'

interface RequestBody {
    email?: string
    password?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(req.body)

    const params: RequestBody = JSON.parse(req.body)

    console.log(params)

    try {
        const rsp = await call('/users/login', params)
        res.setHeader(
            'Set-Cookie',
            serialize('token', rsp.token, { path: '/' })
        )
        res.status(200).json(rsp)
    } catch ({ error, code }) {
        res.status(code).json({ error })
    }
}
