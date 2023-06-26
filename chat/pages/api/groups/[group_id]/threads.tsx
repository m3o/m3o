import { NextApiRequest, NextApiResponse } from 'next'
import call from '../../../../lib/micro'
import TokenFromReq from '../../../../lib/token'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        query: { group_id },
    } = req

    if (req.method !== 'POST') {
        res.status(405).json({})
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

    // load the groups the user is a part of
    let group: any
    try {
        const rsp = await call('/groups/List', { member_id: user.id })
        group = rsp.groups?.find((g) => g.id === group_id)
        if (!group) {
            res.status(403).json({ error: 'Not a member of this group' })
            return
        }
    } catch ({ error, code }) {
        console.error(`Error loading groups: ${error}, code: ${code}`)
        res.status(500).json({ error: 'Error loading groups' })
        return
    }

    // parse the request
    let body: any
    try {
        body = JSON.parse(req.body)
    } catch {
        body = {}
    }

    // create the thread
    let conversation: any
    try {
        const rsp = await call('/threads/CreateConversation', {
            group_id,
            topic: body.topic,
        })
        conversation = rsp.conversation
    } catch ({ error, code }) {
        res.status(code).json({ error })
    }

    // publish the message to the users in the group
    try {
        group.member_ids.forEach(async (id: string) => {
            await call('/streams/Publish', {
                topic: id,
                message: JSON.stringify({
                    type: 'tread.created',
                    group_id: group.id,
                    payload: conversation,
                }),
            })
        })
        res.status(201).json(conversation)
    } catch ({ error, code }) {
        console.error(`Error publishing to stream: ${error}, code: ${code}`)
        res.status(500).json({ error: 'Error publishing to stream' })
        return
    }
}
