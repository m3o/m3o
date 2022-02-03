import { URLS, LOGIN_URL } from '../constants'

export function returnLoginUrl(): string {
  return `${URLS[process.env.NODE_ENV]}${LOGIN_URL}`
}
