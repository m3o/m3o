import type { NextApiRequest, NextApiResponse } from 'next'
import type { M3OError } from '@/types/m3o'
import { m3o } from '@/lib/m3o'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'METHOD_NOT_ALLOWED' })
    }

    console.log(req.body.email)

    try {
        await m3o.user.sendPasswordResetEmail({
            email: req.body.email,
            from_name: 'mu.xyz',
            subject: 'Password reset',
            text_content:
                'Please enter this code to reset your password: $code',
        })

        res.json({})
    } catch (error) {
        console.log(`[SEND RESET PASSWORD EMAIL]: Error`, error)
        const _error = error as M3OError

        res.status(_error.code).json({
            message: _error.detail,
        })
    }
}
