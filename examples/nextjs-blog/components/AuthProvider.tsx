import {useRouter} from 'next/router';
import {LoginUserResponse, UserAccount} from '@m3o/m3o-node';
import {createContext, useEffect, useState, FC, useContext} from 'react';
import {useCookies} from 'react-cookie';
import {get, post} from '../lib/fetch';
import {LoginFields} from '../lib/types';

type Context = ReturnType<typeof useMicroAuth> | undefined;

const AuthContext = createContext<Context>(undefined);

export const AuthProvider: FC = ({children}) => {
  const microAuth = useMicroAuth();

  return (
    <AuthContext.Provider value={microAuth}>{children}</AuthContext.Provider>
  );
};

function useLogin() {
  const [, setCookie] = useCookies(['session']);
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false);

  const login = async (payload: LoginFields) => {
    setLoggingIn(true);
    const response = await post<LoginUserResponse>('user/login', payload);

    setCookie('session', JSON.stringify(response.session), {
      path: '/',
      sameSite: true,
      expires: new Date(response.session.expires),
    });

    setLoggingIn(false);

    router.push('/');
  };

  return {login, loggingIn};
}

export function useMicroAuth() {
  const router = useRouter();
  const login = useLogin();
  const [authenticating, setAuthenticating] = useState(true);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['session']);

  const logout = async () => {
    if (!cookies) return;
    await post('user/logout', {sessionId: cookies.session.id});
    removeCookie('session');
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    async function authenticateUser() {
      if (!cookies.session) return;

      try {
        const response = await get<UserAccount>('user/authenticate');
        setUser(response);
      } catch (e) {
        console.log(e);
      }

      setAuthenticating(false);
    }

    authenticateUser();
  }, [cookies.session]);

  return {
    authenticating,
    ...login,
    logout,
    user,
  };
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Please use within AuthProvider');
  }

  return context;
}
