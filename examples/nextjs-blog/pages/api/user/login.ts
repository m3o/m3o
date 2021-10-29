import {NextApiRequest, NextApiResponse} from 'next';
import {user} from '../../../m3o/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return;

  try {
    const response = await user.login(req.body);
    res.send(response);
  } catch (e) {
    res.status(e.Code).send({
      message: e.Detail,
    });
  }
}
