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

    if (req.method !== 'GET' && req.method !== 'PATCH') {
        res.status(405)
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

    // load the group
    let group: any
    try {
        const rsp = await call('/groups/Read', { ids: [group_id] })
        group = rsp.groups[group_id as string]
    } catch ({ error, code }) {
        console.error(`Error loading groups: ${error}, code: ${code}`)
        res.status(500).json({ error: 'Error loading groups' })
        return
    }
    if (!group) {
        res.status(404).json({ error: 'Group not found' })
        return
    }

    // ensure the user is a member of the group
    if (!group.member_ids?.includes(user.id)) {
        res.status(403).json({ error: 'Not a member of this group' })
        return
    }

    // update the groups name
    if (req.method === 'PATCH') {
        let body: { name?: string } = {}
        try {
            body = JSON.parse(req.body)
        } catch (error) {
            res.status(400).json({ error: 'Error parsing request body' })
        }
        if (!body.name?.length) {
            res.status(400).json({ error: 'Name required' })
        }

        try {
            await call('/groups/Update', { id: group.id, name: body.name })
        } catch ({ error, code }) {
            console.error(`Error updating group: ${error}, code: ${code}`)
            res.status(500).json({ error: 'Error updating group' })
            return
        }

        // publish the message to the other users in the group
        try {
            group.member_ids.forEach(async (id: string) => {
                await call('/streams/Publish', {
                    topic: id,
                    message: JSON.stringify({
                        type: 'group.updated',
                        group_id: group.id,
                        payload: { name: body.name },
                    }),
                })
            })
            res.status(200).json({})
            return
        } catch ({ error, code }) {
            console.error(`Error publishing to stream: ${error}, code: ${code}`)
            res.status(500).json({ error: 'Error publishing to stream' })
            return
        }
    }

    // load the conversations and the recent messages within them
    let threads: any
    try {
        const rsp = await call('/threads/ListConversations', { group_id })
        threads = rsp.conversations || []
    } catch ({ error, code }) {
        console.error(`Error loading conversations: ${error}, code: ${code}`)
        res.status(500).json({ error: 'Error loading conversations' })
        return
    }
    let messages: any = {}
    const user_ids: any = [...(group.member_ids || [])]
    if (threads.length > 0) {
        try {
            const rsp = await call('/threads/RecentMessages', {
                conversation_ids: threads.map((s) => s.id),
            })
            if (rsp.messages) {
                user_ids.push(...rsp.messages.map((m) => m.author_id))
                messages = rsp.messages.reduce((res, m) => {
                    return {
                        ...res,
                        [m.conversation_id]: [
                            ...(res[m.conversation_id] || []),
                            m,
                        ],
                    }
                }, {})
            }
        } catch ({ error, code }) {
            console.error(
                `Error loading recent messages: ${error}, code: ${code}`
            )
            res.status(500).json({ error: 'Error loading recent messages' })
            return
        }
    }

    // load the recent messages for all members
    const chatMessages: Record<string, any[]> = {}
    await Promise.all(
        group.member_ids
            .filter((id) => user.id !== id)
            .map(async (id: string) => {
                let chat_id: any
                try {
                    const rsp = await call('/chats/CreateChat', {
                        user_ids: [user.id, id],
                    })
                    chat_id = rsp.chat.id
                } catch ({ error, code }) {
                    console.error(`Error loading chat: ${error}, code: ${code}`)
                    return
                }

                try {
                    const rsp = await call('/chats/ListMessages', { chat_id })
                    chatMessages[id] = rsp.messages || []
                } catch ({ error, code }) {
                    console.error(
                        `Error loading messages: ${error}, code: ${code}`
                    )
                }
            })
    )

    // load the details of the users
    let users: any
    try {
        users = (await call('/users/read', { ids: user_ids })).users
    } catch ({ error, code }) {
        console.error(`Error loading users: ${error}, code: ${code}`)
        res.status(500).json({ error: 'Error loading users' })
        return
    }

    // load the last time each thread and chat was seen
    let threadLastSeens = {}
    if (threads.length > 0) {
        try {
            const req = {
                user_id: user.id,
                resource_type: 'thread',
                resource_ids: threads.map((s) => s.id),
            }
            threadLastSeens = (await call('/seen/Read', req)).timestamps || {}
        } catch ({ error, code }) {
            console.error(`Error loading last seen: ${error}, code: ${code}`)
            res.status(500).json({ error: 'Error loading last seen times' })
            return
        }
    }
    let chatLastSeens = {}
    try {
        const req = {
            user_id: user.id,
            resource_type: 'chat',
            resource_ids: Object.keys(users),
        }
        chatLastSeens = (await call('/seen/Read', req)).timestamps || {}
    } catch ({ error, code }) {
        console.error(`Error loading last seen: ${error}, code: ${code}`)
        res.status(500).json({ error: 'Error loading last seen times' })
        return
    }

    // generate a token for the websocket
    const websocket: any = { topic: user.id }
    try {
        websocket.token = (await call('/streams/Token', websocket)).token
        let protocol = 'ws'
        if (req.headers.referer && req.headers.referer.startsWith('https:')) {
            protocol = 'wss'
        }
        websocket.url =
            protocol + '://' + req.headers.host + '/api/streams/subscribe'
    } catch ({ error, code }) {
        console.error(`Error loading websocket token: ${error}, code: ${code}`)
        res.status(500).json({ error: 'Error loading websocket token' })
        return
    }

    // return the data
    res.status(200).json({
        id: group.id,
        name: group.name,
        members: group.member_ids.map((id) => ({
            ...users[id],
            current_user: users[id].id === user.id,
            chat: {
                last_seen: chatLastSeens[id],
                messages: (chatMessages[id] || []).map((m) => ({
                    id: m.id,
                    text: m.text,
                    sent_at: m.sent_at,
                    author: {
                        ...users[m.author_id],
                        current_user: m.author_id === user.id,
                    },
                })),
            },
        })),
        threads: threads.map((s) => ({
            id: s.id,
            topic: s.topic,
            last_seen: threadLastSeens[s.id],
            messages: (messages[s.id] || []).map((m) => ({
                id: m.id,
                text: m.text,
                sent_at: m.sent_at,
                author: {
                    ...users[m.author_id],
                    current_user: m.author_id === user.id,
                },
            })),
        })),
        websocket,
    })
}
