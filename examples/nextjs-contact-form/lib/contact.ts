import { ContactFormFields, ApiErrorResponse } from './types'

export async function sendContactDetails(values: ContactFormFields) {
  const response = await fetch('/api/contact', {
    method: 'post',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (response.status >= 400) {
    const errorResponse = (await response.json()) as ApiErrorResponse
    return Promise.reject(errorResponse.error.message)
  }

  return Promise.resolve(response)
}
