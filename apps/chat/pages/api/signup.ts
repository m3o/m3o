import { NextApiRequest, NextApiResponse } from 'next'
import { m3o } from '../../lib/m3o'
import type { M3OError } from '../../types/m3o'
import type { RegisterFields } from '../../types/user'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body as RegisterFields

    try {
        const response = await m3o.user.create({
            email: body.email,
            username: body.email,
            password: body.password,
            profile: {
                firstName: body.firstName,
                lastName: body.lastName,
            },
        })

        res.json({})

        console.log(response)
    } catch (error) {
        const _error = error as M3OError

        res.status(_error.code).json({
            message: _error.detail,
        })
    }
}
