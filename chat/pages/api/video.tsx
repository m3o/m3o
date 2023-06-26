import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'
import call from '../../lib/micro'
import TokenFromReq from '../../lib/token'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = TokenFromReq(req)
  if (!token) {
    res.status(401).json({ error: 'No token cookie set' })
    return
  }

  let user: any
  try {
    const rsp = await call('/users/validate', { token })
    user = rsp.user
  } catch ({ error, code }) {
    const statusCode = code === 400 ? 401 : code
    res.status(statusCode).json({ error })
    return
  }

  const accessToken = new twilio.jwt.AccessToken(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_API_KEY!,
    process.env.TWILIO_API_SECRET!,
    {
      ttl: 60 * 60 * 24,
      identity: user.id,
    }
  )

  const grant = new twilio.jwt.AccessToken.VideoGrant()
  accessToken.addGrant(grant)
  grant.toPayload()

  res.status(200).json({ identity: user.id, token: accessToken.toJwt() })
}
