import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import call from '../../lib/micro'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let body: any
  try {
    body = JSON.parse(req.body)
  } catch (error) {
    res.status(400).json({ error: 'Error parsing request body' })
    return
  }

  let invite: any
  if (body.code?.length) {
    try {
      const rsp = await call('/invites/Read', { code: body.code })
      invite = rsp.invite
    } catch ({ code, error }) {
      res.status(code).json({ error })
      return
    }
  }

  let user: any
  let token: any
  try {
    const rsp = await call('/users/create', {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: body.password,
    })
    user = rsp.user
    token = rsp.token
    res.setHeader('Set-Cookie', serialize('token', rsp.token, { path: '/' }))
  } catch ({ error, code }) {
    res.status(code).json({ error })
    return
  }

  if (!invite) {
    res.status(200).json({ user, token })
    return
  }

  // load the group to get the members
  let group: any
  try {
    group = (await call('/groups/Read', { ids: [invite.group_id] })).groups[
      invite.group_id
    ]
  } catch ({ error, code }) {
    console.error(`Error reading group: ${error}, code: ${code}`)
    res.status(500).json({ error: 'Error reading group' })
    return
  }

  // add the user as a member of the group
  try {
    await call('/groups/AddMember', {
      group_id: invite.group_id,
      member_id: user.id,
    })
  } catch ({ error, code }) {
    console.error(`Error adding member to group: ${error}, code: ${code}`)
    res.status(500).json({ error: 'Error accepting invitation' })
    return
  }

  // delete the invitation
  try {
    await call('/invites/Delete', { id: invite.id })
  } catch ({ error, code }) {
    console.error(`Error deleting invite: ${error}, code: ${code}`)
    res.status(500).json({ error: 'Error accepting invitation' })
    return
  }

  // publish the message to the users in the group
  try {
    group.member_ids.forEach(async (id: string) => {
      await call('/streams/Publish', {
        topic: id,
        message: JSON.stringify({
          type: 'group.user.joined',
          group_id: group.id,
          payload: user,
        }),
      })
    })
    res.status(200).json({ user, token })
  } catch ({ error, code }) {
    console.error(`Error publishing to stream: ${error}, code: ${code}`)
    res.status(500).json({ error: 'Error publishing to stream' })
  }
}
