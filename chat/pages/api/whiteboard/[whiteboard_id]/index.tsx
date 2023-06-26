import { NextApiRequest, NextApiResponse } from 'next'
import Call from '../../../../lib/micro'
import TokenFromReq from '../../../../lib/token'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { whiteboard_id },
  } = req

  const token = TokenFromReq(req)
  if (!token) {
    res.status(200).json({})
    return
  }

  if (req.method === 'GET') {
    const websocket: any = { topic: 'whiteboard-' + whiteboard_id }
    try {
      websocket.token = (await Call('/streams/Token', websocket)).token
      let protocol = 'ws'
      if (req.headers.referer && req.headers.referer.startsWith('https:')) {
        protocol = 'wss'
      }
      websocket.url =
        protocol + '://' + req.headers.host + '/api/streams/subscribe'
      res.status(200).json({ websocket })
    } catch ({ error, code }) {
      console.error(`Error loading websocket token: ${error}, code: ${code}`)
      res.status(500).json({ error: 'Error loading websocket token' })
    }
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({})
    return
  }

  let body: { x?: number; y?: number; status?: string; id?: string }
  try {
    body = JSON.parse(req.body)
  } catch (error) {
    res.status(400).json({ error: `Error parsing request body: ${error}` })
    return
  }
  if (!body.x || !body.y) {
    res.status(400).json({ error: 'Missing X or Y value' })
    return
  }
  if (!body.status) {
    res.status(400).json({ error: 'Missing status' })
    return
  }
  if (!body.id) {
    res.status(400).json({ error: 'Missing ID' })
    return
  }

  try {
    console.log('Publishing to topic', 'whiteboard-' + whiteboard_id)
    await Call('/streams/Publish', {
      topic: 'whiteboard-' + whiteboard_id,
      message: JSON.stringify(body),
    })
    res.status(201).json({})
  } catch (error) {
    res.status(500).json({ error: 'Error connecting to Micro' })
  }
}
