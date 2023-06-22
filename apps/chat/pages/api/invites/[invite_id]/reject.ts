import type { NextApiRequest, NextApiResponse } from 'next'
import { invitesDb } from '@/lib/api/invites/db'
import { authenticatedHandler } from '@/lib/authentication'

async function rejectInvite(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Delete it
        await invitesDb.delete(req.query.invite_id as string)

        res.json({})
    } catch (error) {
        console.log(error)
    }
}

export default authenticatedHandler(async function handler(req, res) {
    if (req.method == 'POST') {
        await rejectInvite(req, res)
        return
    }

    res.status(405).json({ message: 'METHOD_NOT_ALLOWED' })
})
