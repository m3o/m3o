import type { GetServerSidePropsContext } from 'next'
import { AuthCookieNames } from '@/lib/constants'
import { m3oInstance } from '../api'

interface TokenRequest {
  refresh_token: string
}

interface TokenResponse {
  token: Token
}

interface InspectResponse {
  account: Account
}

interface InspectProps {
  microToken: string
  namespace: string
}

interface OAuthResponse {
  url: string
}

export interface OAuthCallbackRequest {
  code?: string
  state?: string
  error_reason?: string
  test: boolean
}

// response type of both complete signup and oauth login
interface SignUpResponse {
  authToken: Token
  namespace: string
  // this only applies to oauth login
  is_signup?: boolean
}

export interface ResetPasswordPayload {
  email: string
  token: string
  password: string
}

interface SendVerificationEmailPayload {
  email: string
}

export enum UserEndpoints {
  Inspect = '/auth/Auth/Inspect',
  Login = '/customers/Login',
  Logout = '/customers/Logout',
  Token = '/auth/Auth/Token',
  GoogleAuth = '/oauth/Oauth/GoogleURL',
  GoogleAuthLogin = '/oauth/Oauth/GoogleLogin',
  GithubAuth = '/oauth/Oauth/GithubURL',
  GithubAuthLogin = '/oauth/Oauth/GithubLogin',
  Recover = '/signup/recover',
  ResetPassword = '/signup/resetPassword',
}

export async function inspectUser({
  microToken,
  namespace,
}: InspectProps): Promise<InspectResponse> {
  const response = await m3oInstance.post<InspectResponse>(
    UserEndpoints.Inspect,
    {
      token: microToken,
      options: {
        namespace,
      },
    },
  )

  return response.data
}

export async function getUserToken(
  req: GetServerSidePropsContext['req'],
): Promise<string | Token> {
  const { cookies } = req
  const expiry = parseInt(cookies[AuthCookieNames.Expiry], 10) * 1000

  if (expiry - Date.now() > 60 * 1000) {
    return Promise.resolve(cookies[AuthCookieNames.Token])
  }

  const response = await m3oInstance.post<TokenResponse>(UserEndpoints.Login, {
    refresh_token: cookies[AuthCookieNames.Refresh],
  })

  return response.data.token
}

export async function loginUser({
  email,
  password,
}: LoginFormFields): Promise<LoginTokenResponse> {
  const response = await m3oInstance.post<LoginTokenResponse>(
    UserEndpoints.Token,
    {
      id: email,
      secret: password,
      options: {
        namespace: process.env.NEXT_PUBLIC_NAMESPACE,
      },
      token_expiry: 30 * 24 * 3600,
    },
  )

  return response.data
}

export async function googleOauthURL(): Promise<string> {
  const response = await m3oInstance.post<OAuthResponse>(
    UserEndpoints.GoogleAuth,
    {},
    {
      headers: {
        'Micro-Namespace': process.env.NEXT_PUBLIC_NAMESPACE as string,
      },
    },
  )

  return response.data.url
}

export async function googleOauthCallback(
  payload: OAuthCallbackRequest,
): Promise<SignUpResponse> {
  const response = await m3oInstance.post<SignUpResponse>(
    UserEndpoints.GoogleAuthLogin,
    payload,
    {
      headers: {
        'Micro-Namespace': process.env.NEXT_PUBLIC_NAMESPACE as string,
      },
    },
  )

  return response.data
}

export async function githubOauthCallback(
  payload: OAuthCallbackRequest,
): Promise<SignUpResponse> {
  const response = await m3oInstance.post<SignUpResponse>(
    UserEndpoints.GithubAuthLogin,
    payload,
    {
      headers: {
        'Micro-Namespace': process.env.NEXT_PUBLIC_NAMESPACE as string,
      },
    },
  )

  return response.data
}

export function logout(token: string) {
  return m3oInstance.post(
    UserEndpoints.Logout,
    {},
    {
      headers: {
        'Micro-Namespace': 'micro',
        authorization: `Bearer ${token}`,
      },
    },
  )
}

export function fetchRecoveryCode(email: string): Promise<void> {
  return m3oInstance.post(
    UserEndpoints.Recover,
    {
      email,
    },
    {
      headers: {
        'Micro-Namespace': process.env.NEXT_PUBLIC_NAMESPACE as string,
      },
    },
  )
}

export function resetPassword(payload: ResetPasswordPayload) {
  return m3oInstance.post(UserEndpoints.ResetPassword, payload, {
    headers: {
      'Micro-Namespace': process.env.NEXT_PUBLIC_NAMESPACE as string,
    },
  })
}

export function sendVerificationEmail(payload: SendVerificationEmailPayload) {
  return m3oInstance.post('/signup/User', payload)
}
