import type { Track } from '@/types'
import { m3oInstance } from '../api'

export function track(payload: Track) {
  return m3oInstance.post('/onboarding/signup/Track', payload)
}

export function trackRegistration() {
  const reg = Math.floor(Date.now() / 1000)
}
