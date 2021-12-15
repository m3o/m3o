import { RequestError } from '@m3o/types'

export async function post<
  D extends Record<string, any>,
  R extends Record<string, any>
>(url: string, data?: D): Promise<R> {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data || {}),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    return response.json()
  }

  throw ((await response.json()) as RequestError).error
}
