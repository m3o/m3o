import type { NextApiRequest, NextApiResponse } from 'next'
import { invitesDb } from '@/lib/api/invites/db'
import { membersDb } from '@/lib/api/members/db'
import { authenticatedHandler } from '@/lib/authentication'
import { UserAccount } from '@/types/user'

async function acceptInvite(
    req: NextApiRequest,
    res: NextApiResponse,
    user: UserAccount
) {
    try {
        // Get the invite
        const invite = await invitesDb.getById(req.query.invite_id as string)

        // Delete it
        await invitesDb.delete(invite.id)

        // Create a new member of the group
        await membersDb.addToGroup({ groupId: invite.groupId, userId: user.id })

        res.json({})
    } catch (error) {
        console.log(error)
    }
}

export default authenticatedHandler(async function handler(req, res, user) {
    if (req.method == 'POST') {
        await acceptInvite(req, res, user)
        return
    }

    res.status(405).json({ message: 'METHOD_NOT_ALLOWED' })
})
