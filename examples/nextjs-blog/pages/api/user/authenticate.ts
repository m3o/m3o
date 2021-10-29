import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromServerRequestNextJs } from '../../../m3o/user/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.status(404).send({});
    return;
  }

  try {
    const user = await getUserFromServerRequestNextJs(req);
    res.send(user);
  } catch (e) {
    res.status(e.Code).send({
      message: e.Detail,
    });
  }
}
