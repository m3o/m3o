import { authenticatedHandler } from '@/lib/authentication'
import { m3o } from '@/lib/m3o'

export default authenticatedHandler(async function handler(req, res, user) {
    const websocket = await m3o.event.consume({
        topic: req.query.topic_id as string,
    })

    console.log(websocket)
})
