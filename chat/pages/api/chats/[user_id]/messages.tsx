import { NextApiRequest, NextApiResponse } from 'next'
import call from '../../../../lib/micro'
import TokenFromReq from '../../../../lib/token'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { user_id },
  } = req

  if (req.method !== 'POST' && req.method !== 'GET') {
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

  // load the user they are opening the chat with
  let chatUser: any
  try {
    const rsp = await call('/users/read', { ids: [user_id] })
    chatUser = rsp.users[user_id as string]
  } catch ({ error, code }) {
    res.status(code).json({ error })
    return
  }

  // load the thread
  let chat_id: any
  try {
    const rsp = await call('/chats/CreateChat', {
      user_ids: [user.id, user_id],
    })
    chat_id = rsp.chat.id
  } catch ({ error, code }) {
    console.error(`Error loading chat: ${error}, code: ${code}`)
    res.status(code).json({ error })
    return
  }

  // if a get request, load the messages in the chat
  if (req.method === 'GET') {
    let messages = []
    try {
      const rsp = await call('/chats/ListMessages', { chat_id })
      messages = rsp.messages || []
    } catch ({ error, code }) {
      console.error(`Error loading messages: ${error}, code: ${code}`)
      res.status(500).json({ error: 'Error loading messages' })
    }
    if (messages.length === 0) {
      res.status(200).json([])
      return
    }

    const users = {
      [user.id]: { ...user, current_user: true },
      [chatUser.id]: chatUser,
    }
    res.status(200).json(
      messages.map((m) => ({
        id: m.id,
        text: m.text,
        sent_at: m.sent_at,
        author: { ...users[m.author_id] },
      }))
    )
    return
  }

  // parse the request
  let body: any
  try {
    body = JSON.parse(req.body)
  } catch {
    body = {}
  }

  // create the message
  let msg: any
  try {
    const params = {
      id: body.id,
      chat_id: chat_id,
      author_id: user.id,
      text: body.text,
    }
    msg = (await call('/chats/CreateMessage', params)).message
  } catch ({ error, code }) {
    res.status(code || 500).json({ error })
    return
  }

  // publish the message to the other user and ourselves
  try {
    await call('/streams/Publish', {
      topic: chatUser.id,
      message: JSON.stringify({
        type: 'message.created',
        payload: {
          chat: {
            id: user.id,
            type: 'chat',
          },
          message: {
            id: msg.id,
            text: msg.text,
            sent_at: msg.sent_at,
            author: { ...user },
          },
        },
      }),
    })
    await call('/streams/Publish', {
      topic: user.id,
      message: JSON.stringify({
        type: 'message.created',
        payload: {
          chat: {
            id: user.id,
            type: 'chat',
          },
          message: {
            id: msg.id,
            text: msg.text,
            sent_at: msg.sent_at,
            author: { ...user, current_user: true },
          },
        },
      }),
    })
  } catch ({ error, code }) {
    console.error(`Error publishing to stream: ${error}, code: ${code}`)
    res.status(500).json({ error: 'Error publishing to stream' })
    return
  }

  // serialize the response
  res.status(201).json({
    id: msg.id,
    text: msg.text,
    sent_at: msg.sent_at,
    author: { ...user, current_user: true },
  })
}
