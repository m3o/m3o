import {NextApiRequest, NextApiResponse} from 'next';
import {user} from '../../../m3o/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(404).send({});
    return;
  }

  try {
    await user.signUp(req.body);
    res.send({});
  } catch (e) {
    res.status(e.Code).send({
      message: e.Detail,
    });
  }
}
