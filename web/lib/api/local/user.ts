import type { AxiosResponse } from 'axios'
import type { NextRouter } from 'next/router'
import { SessionStorageKeys, RegisterFlows, Routes } from '@/lib/constants'
import { apiInstance } from './api'

export interface LoginUserPayload {
  email: string
  password: string
}

export interface SendVerificationEmailPayload {
  email: string
}

export enum UserEndpoints {
  Login = '/user/login',
  Logout = '/user/logout',
  SendVerificationEmail = '/user/send-verification-email',
  VerifySignup = '/user/verify-signup',
}

export function loginUser(payload: LoginUserPayload): Promise<void> {
  return apiInstance.post(UserEndpoints.Login, payload)
}

export function logoutUser(): Promise<void> {
  return apiInstance.post(UserEndpoints.Logout)
}

export function sendVerificationEmail(
  payload: SendVerificationEmailPayload,
): Promise<AxiosResponse<void>> {
  return apiInstance.post(UserEndpoints.SendVerificationEmail, payload)
}

export function handleSuccessfulOAuthLogin(router: NextRouter) {
  const subscriptionFlow = sessionStorage.getItem(
    SessionStorageKeys.SubscriptionFlow,
  )

  const redirectTo = sessionStorage.getItem(
    SessionStorageKeys.RedirectToAfterLogin,
  )

  if (subscriptionFlow) {
    router.push(`${Routes.SubscriptionCardDetails}?tier=${subscriptionFlow}`)
    return
  }

  sessionStorage.removeItem(SessionStorageKeys.RedirectToAfterLogin)

  if (redirectTo?.charAt(0) === '/') {
    router.push(redirectTo)
  } else {
    router.push(Routes.Home)
  }
}
