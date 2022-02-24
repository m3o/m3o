export interface UsageRecord {
  date: string
  requests: string
}

export interface FormattedUsageRecord {
  date: Date
  requests: number
  apiName: string
}

export interface UsageItem {
  api_name: string
  records: UsageRecord[]
}

export interface FormattedUsageItem {
  name: string
  records: FormattedUsageRecord[]
}

export type Usage = Record<string, UsageItem>
export type FormattedUsage = FormattedUsageItem[]

export interface VerifySignUpPayload {
  email: string
  token: string
  secret: string
}

export interface OAuthCallbackRequest {
  code?: string
  state?: string
  error_reason?: string
  test: boolean
}

export interface Token {
  access_token: string
  refresh_token: string
  created: string
  expiry: string
}

export interface SignUpResponse {
  authToken: Token
  namespace: string
  // this only applies to oauth login
  is_signup?: boolean
}
