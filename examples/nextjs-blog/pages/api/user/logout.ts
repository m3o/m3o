import {NextApiRequest, NextApiResponse} from 'next';
import {user} from '../../../m3o/user';

type LogoutBody = {
  sessionId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return;

  const body = req.body as LogoutBody;

  try {
    const response = await user.logout({
      sessionId: body.sessionId,
    });

    res.send(response);
  } catch (e) {
    res.status(e.Code).send({
      message: e.Detail,
    });
  }
}
