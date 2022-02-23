import axios from 'axios'
import { useMutation } from 'react-query'
import { useCookies } from 'react-cookie'
import { AxiosError } from 'axios'
import { useRevokeKey } from '@/hooks'
import { AuthCookieNames } from '@/lib/constants'
import { getPersonalToken } from '@/lib/api/local/v1-api'

export interface CallV1ApiPayload {
  endpoint: string
  service: string
  json: Record<string, unknown>
}

export async function callV1Api(
  token: string,
  payload: CallV1ApiPayload,
): Promise<unknown> {
  const endpointName = payload.endpoint.replace(' ', '')

  try {
    const response = await axios.post<unknown>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/${payload.service}/${endpointName}`,
      payload.json,
      {
        headers: {
          'Micro-Namespace': 'micro',
          authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data
  } catch (e) {
    const error = e as AxiosError
    throw error.response?.data as ApiError
  }
}

export function useCallV1Api() {
  const [cookies, , removeCookie] = useCookies()
  const { mutateAsync } = useRevokeKey({})

  return useMutation(async (payload: CallV1ApiPayload) => {
    const token = cookies[AuthCookieNames.ApiToken]

    try {
      return await callV1Api(token, payload)
    } catch (e) {
      const error = e as ApiError

      if (error.Code === 401) {
        await mutateAsync(cookies[AuthCookieNames.ApiTokenId])
        removeCookie(AuthCookieNames.ApiToken)
        removeCookie(AuthCookieNames.ApiTokenId)
        await getPersonalToken()
        const response = await callV1Api(token, payload)
        return response
      }

      throw error.Detail
    }
  })
}
