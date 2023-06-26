import { NextApiRequest, NextApiResponse } from 'next'
import call from '../../../lib/micro'
import TokenFromReq from '../../../lib/token'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // ignore any OPTIONS requests
    if (!['GET', 'POST']?.includes(req.method)) {
        res.status(200)
        return
    }

    // get the token from cookies
    const token = TokenFromReq(req)
    if (!token) {
        res.status(401).json({ error: 'No token cookie set' })
        return
    }

    // authenticate the request
    let user: any
    try {
        const rsp = await call('/users/validate', { token })
        user = rsp.user
    } catch ({ error, code }) {
        const statusCode = code === 400 ? 401 : code
        res.status(statusCode).json({ error })
        return
    }

    switch (req.method) {
        case 'GET': {
            // load the groups
            let groups = []
            try {
                const rsp = await call('/groups/List', { member_id: user.id })
                groups = rsp.groups || []
            } catch ({ error, code }) {
                console.error(`Error loading groups: ${error}. code: ${code}`)
                res.status(500).json({ error })
                return
            }

            // load the details of the users
            let users: any
            try {
                const user_ids = groups.map((g) => g.member_ids).flat()
                users = (await call('/users/read', { ids: user_ids })).users
            } catch ({ error, code }) {
                console.error(`Error loading users: ${error}, code: ${code}`)
                res.status(500).json({ error: 'Error loading users' })
                return
            }

            res.status(200).json(
                groups.map((g) => ({
                    id: g.id,
                    name: g.name,
                    members: g.member_ids.map((id) => users[id]),
                }))
            )
            return
        }
        case 'POST': {
            // create a group
            let group: any
            try {
                const rsp = await call('/groups/Create', JSON.parse(req.body))
                group = rsp.group
            } catch ({ error, code }) {
                res.status(code).json({ error })
                return
            }

            // join the group
            try {
                await call('/groups/AddMember', {
                    group_id: group.id,
                    member_id: user.id,
                })
                res.status(201).json({ group })
            } catch ({ error, code }) {
                res.status(code).json({ error })
            }
        }
    }
}
