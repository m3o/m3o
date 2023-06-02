import { NextApiRequest, NextApiResponse } from 'next'
import call from '../../lib/micro'

const templateId = 'd-02aefa32b6de484aa850d794cb8cf471'
const from = 'Micro Chat <support@m3o.com>'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let body: any
  try {
    body = JSON.parse(req.body)
  } catch (error) {
    res.status(400).json({ error: 'Erorr parsing request body' })
    return
  }

  let user: any
  try {
    const rsp = await call('/users/ReadByEmail', { emails: [body.email] })
    user = rsp.users ? rsp.users[body.email?.toLowerCase()] : null
  } catch ({ error, code }) {
    console.error(`Error reading users: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
  if (!user) {
    res.status(400).json({ error: 'User not found' })
    return
  }

  let code: string
  try {
    const rsp = await call('/otp/Generate', { id: user.email, expiry: 360 })
    code = rsp.code
  } catch ({ error, code }) {
    console.error(`Error creating code: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
    return
  }

  try {
    const dynamicTemplateData = { name: user.first_name, code }
    await call('/emails/Send', {
      to: user.email,
      from,
      JSON.stringify(dynamicTemplateData),
      templateId,
    })
    res.status(200).json({})
  } catch (error) {
    console.warn(`Error sending email: ${error}`)
    res.status(500).json({ error: 'Erorr sending code via email' })
  }
}
