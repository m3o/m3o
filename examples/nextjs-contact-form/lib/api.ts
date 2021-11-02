import type { NextApiResponse } from 'next'

interface SendError {
  message: string
  res: NextApiResponse
  statusCode: number
}

export function sendError({ message, res, statusCode }: SendError): void {
  res.status(statusCode).send({ error: { message } })
}
