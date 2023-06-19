import { authenticatedHandler } from '@/lib/authentication'
import { tableNames } from '@/lib/constants'
import { m3o } from '@/lib/m3o'

export default authenticatedHandler(async function handler(req, res, user) {
    try {
        const response = await m3o.db.create({
            table: tableNames['stream_items'],
            record: {
                content: req.body.content,
                contextId: req.body.contextId,
                groupId: req.body.groupId,
                type: 'message',
                userId: user.id,
                createdAt: new Date().toISOString(),
            },
        })
    } catch (error) {
        console.error(error)
    }
})
