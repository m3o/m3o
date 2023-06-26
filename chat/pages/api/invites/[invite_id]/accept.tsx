import { NextApiRequest, NextApiResponse } from 'next'
import call from '../../../../lib/micro'
import TokenFromReq from '../../../../lib/token'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { invite_id },
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

  // load the invite
  let invite: any
  try {
    const rsp = await call('/invites/Read', { id: invite_id })
    invite = rsp.invite
  } catch ({ error, code }) {
    console.error(`Error loading invite: ${error}, code: ${code}`)
    res.status(code).json({ error })
    return
  }

  // check the user was infact the one who was sent the invite
  if (invite.email !== user.email) {
    res.status(400).json({ error: 'Your email does not match the invite' })
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
    res.status(200).json({})
  } catch ({ error, code }) {
    console.error(`Error publishing to stream: ${error}, code: ${code}`)
    res.status(500).json({ error: 'Error publishing to stream' })
  }
}
