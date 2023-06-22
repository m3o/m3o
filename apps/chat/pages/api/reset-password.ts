import { m3o } from '@/lib/m3o'
import type { ResetPasswordRequest } from 'm3o/user'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).json({
            message: 'METHOD_NOT_ALLOWED',
        })

        return
    }

    const body = req.body as ResetPasswordRequest

    try {
        await m3o.user.resetPassword(body)
        res.json({})
    } catch (error) {
        console.log(error)
    }
}
