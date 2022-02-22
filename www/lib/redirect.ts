import { sessionStorage } from '@/utils/storage'
import { REDIRECT_TO_KEY } from './constants'

export function shouldRedirectOnLogin(): boolean {
  return !!sessionStorage.getItem(REDIRECT_TO_KEY)
}

export function redirectToCloud(): void {
  window.location.href =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001' // Requires local version of cloud to be running
      : 'https://cloud.m3o.com'
}
