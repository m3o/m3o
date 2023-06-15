import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticatedHandler } from '../../../lib/authentication'
import { tableNames } from '../../../lib/constants'
import { m3o } from '../../../lib/m3o'
import type { M3OError } from '../../../types/m3o'
import type { UserAccount } from '../../../types/user'

async function createGroup(
    req: NextApiRequest,
    res: NextApiResponse,
    user: UserAccount
) {
    if (!req.body.name) {
        res.status(422).send({
            message: 'Please provide the groups name',
        })
    }

    try {
        // Create the group
        const group = await m3o.db.create({
            table: tableNames.groups,
            record: {
                name: req.body.name,
                paid: false,
            },
        })

        // Add the member to group as you can't look into lists in the DB service.
        await m3o.db.create({
            table: tableNames.members,
            record: {
                userId: user.id,
                groupId: group.id,
            },
        })

        res.json({ group })
    } catch (error) {
        console.log(error)
    }
}

async function getUsersGroups(
    req: NextApiRequest,
    res: NextApiResponse,
    user: UserAccount
) {
    try {
        // Get the group IDs that the user is part of
        const members = await m3o.db.read({
            table: tableNames.members,
            query: `userId == "${user.id}"`,
        })

        // Fetch each group by their ID
        const fetchGroupPromises = (members.records || [])
            .map((item) => item.groupId)
            .map((id) =>
                m3o.db.read({
                    table: tableNames.groups,
                    query: `id == "${id}"`,
                })
            )

        // Flatmap the promises to just return the items
        const groups = (await Promise.all(fetchGroupPromises)).flatMap(
            (item) => item.records || []
        )

        res.json({ groups })
    } catch (error) {
        console.log('[FETCH GROUPS]: Error', error)
        const _error = error as M3OError

        res.status(_error.code).send({
            message: _error.detail,
        })
    }
}

export default authenticatedHandler(async function handler(req, res, user) {
    if (req.method === 'POST') {
        return createGroup(req, res, user)
    }

    if (req.method === 'GET') {
        return getUsersGroups(req, res, user)
    }
})
