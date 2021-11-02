import type { NextApiRequest, NextApiResponse } from 'next'
import { EmailService } from 'm3o/email'
import { sendError } from '@lib/api'

const emailService = new EmailService(process.env.M3O_KEY as string)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    sendError({ res, statusCode: 405, message: 'Method not allowed' })
    return
  }

  if (!req.body.message || !req.body.email || !req.body.name) {
    sendError({
      res,
      statusCode: 400,
      message: 'Incorrect information provided',
    })
    return
  }

  try {
    await emailService.send({
      from: '|--- YOUR FROM EMAIL ---|',
      subject: 'Hello from your website',
      to: '|--- YOUR TO EMAIL ---|',
      htmlBody: `
        <p>Dear Owner,</p>
        <p>You have received a new message on Your Website:</p>
        <h4>Name</h4>
        <p>${req.body.name}</p>
        <h4>Email</h4>
        <p>${req.body.email}</p>
        <h4>Message</h4>
        <p>${req.body.message}</p>
      `,
    })

    res.json({})
  } catch (e) {
    sendError({
      res,
      statusCode: 500,
      message: 'Server error',
    })
  }
}
