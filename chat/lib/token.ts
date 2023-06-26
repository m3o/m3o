import { parse } from 'cookie'
import { NextApiRequest } from 'next'

function TokenFromReq(req: NextApiRequest): string {
    if (req.headers.cookie) {
        const token = parse(req.headers.cookie).token
        if (token) return token
    }

    const auth = req.headers['authorization']
    if (auth) return auth.replace('Bearer ', '')
    return ''
}

export default TokenFromReq
