import { authenticatedHandler } from '@/lib/authentication'
import { tableNames } from '@/lib/constants'
import { m3o } from '@/lib/m3o'

export default authenticatedHandler(async function handler(req, res, user) {
    if (req.method === 'POST') {
        try {
            const response = await m3o.db.create({
                table: tableNames['stream_items'],
                record: {
                    content: req.body.message,
                    contextId: req.query.topic_id,
                    groupId: req.query.group_id,
                    type: 'message',
                    userId: user.id,
                    createdAt: new Date().toISOString(),
                },
            })

            res.json({
                message: response,
            })
        } catch (error) {
            console.error(error)
            res.json({
                message: 'Error',
            })
        }
    }
})
