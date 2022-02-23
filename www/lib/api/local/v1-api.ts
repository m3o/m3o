import { apiInstance } from './api'

export async function getPersonalToken() {
  const response = await apiInstance.get<{ token: string }>(
    '/v1-api/get-personal-token',
  )

  return response.data.token
}
