import { m3oInstance } from './api'

const isDevelopment = process.env.NODE_ENV === 'development'

export async function fetchOAuthRedirectUrl(url: string): Promise<string> {
  const {
    data: { url: redirectUrl },
  } = await m3oInstance.post<{ url: string }>(url, {
    test: isDevelopment,
  })

  return redirectUrl
}
