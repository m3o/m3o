import { NextApiRequest, NextApiResponse } from 'next'
import { createInviteEmail } from '@/lib/api/emails/content'
import { groupsDb } from '@/lib/api/groups/db'
import { invitesDb } from '@/lib/api/invites/db'
import { membersDb } from '@/lib/api/members/db'
import { authenticatedHandler } from '@/lib/authentication'
import { m3o } from '@/lib/m3o'

const MAX_USERS = 100

async function sendInvite(req: NextApiRequest, res: NextApiResponse) {
    const groupId = req.query.group_id as string
    const email = req.body.email as string

    if (!groupId) {
        res.status(400).send({ message: 'No group id provided' })
        return
    }

    try {
        const members = await membersDb.getMembersOfGroup(groupId)

        if (members.length === MAX_USERS) {
            res.status(403).send({
                message: 'Already at capacity',
            })

            return
        }

        const group = await groupsDb.byId(groupId)

        console.log(`[INVITE]: Inviting ${email} to ${group.name}`)

        await m3o.email.send({
            from: 'mu.xyz',
            subject: `You have been invited to the group: ${group.name}`,
            to: req.body.email,
            html_body: createInviteEmail(group.name),
        })

        console.log('[INVITE]: Email sent, creating DB record')

        await invitesDb.send({
            email,
            groupId,
        })

        console.log('[INVITE]: Created record')

        res.json({})
    } catch (error) {
        console.log(error)
    }
}

export default authenticatedHandler(async function (req, res) {
    if (req.method === 'POST') {
        return sendInvite(req, res)
    }

    res.status(405).json({
        message: 'METHOD_NOT_ALLOWED',
    })
})
