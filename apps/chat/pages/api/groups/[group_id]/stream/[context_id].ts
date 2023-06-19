import { authenticatedHandler } from '@/lib/authentication'
import { tableNames } from '@/lib/constants'
import { m3o } from '@/lib/m3o'

type ReqQuery = {
    context_id?: string
    group_id?: string
}

export default authenticatedHandler(async function handler(req, res) {
    const { context_id, group_id } = req.query as ReqQuery

    if (!context_id || !group_id) {
        res.status(400).send({
            message: 'Not all the required params are defined',
        })

        return
    }

    try {
        const { records = [] } = await m3o.db.read({
            table: tableNames['stream_items'],
            query: `groupId == "${group_id}" and contextId == "${context_id}"`,
        })

        res.json({
            stream: records,
        })
    } catch (error) {
        console.error(error)
    }
})
