import {NextPageContext} from 'next';
import cookie from 'cookie';
import {UserSession, LoginUserResponse, UserResponse} from '@m3o/m3o-node';
import {user} from '.';

export async function getUserFromServerRequestNextJs(
  req: NextPageContext['req'],
): Promise<UserSession> {
  if (!req?.headers) return null;
  const cookies = cookie.parse(req.headers.cookie || '');

  if (!cookies.session) return null;

  try {
    const microUserCookie = JSON.parse(
      cookies.session,
    ) as LoginUserResponse['session'];

    await user.readSession(microUserCookie.id);

    const response = (await user.getById(
      microUserCookie.userId,
    )) as UserResponse;

    return response.account;
  } catch (e) {
    return null;
  }
}
