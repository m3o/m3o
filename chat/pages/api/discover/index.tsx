import { NextApiRequest, NextApiResponse } from 'next'
import call from '../../../lib/micro'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // ignore any OPTIONS requests
    if (!['GET', 'POST']?.includes(req.method)) {
        res.status(200)
        return
    }

    // load the groups
    let groups = []

    try {
	const rsp = await call('/groups/List', {})
	groups = rsp.groups || []
    } catch ({ error, code }) {
	console.error(`Error loading groups: ${error}. code: ${code}`)
	res.status(500).json({ error })
	return
    }

    res.status(200).json(
                groups.map((g) => ({
                    id: g.id,
                    name: g.name,
                    members: g.member_ids,
                    description: g.description,
                }))
            )

    return groups
}
