import type { AxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { loginUser } from '@/lib/api/m3o/services/auth'
import { setLoginCookies } from '@/lib/user'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { token } = await loginUser(req.body)
    await setLoginCookies(req, res, token)
    res.json(token)
  } catch (e) {
    const error = e as AxiosError
    res.status(error.response?.status!).send(error.response?.data)
  }
}
