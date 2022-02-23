import type { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { apiInstance } from '@/lib/api/local/api'

interface SendVerificationEmailPayload {
  email: string
}

async function sendVerificationEmail(payload: SendVerificationEmailPayload) {
  try {
    const response = await apiInstance.post(
      '/user/send-verification-email',
      payload,
    )
    console.log(response)
  } catch (error) {
    const e = error as AxiosError

    if (e.response?.status === 500) {
      throw 'User with login exists already.'
    }
  }
}

export function useRegister() {
  return useMutation(sendVerificationEmail)
}
