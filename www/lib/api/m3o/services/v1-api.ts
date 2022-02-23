import { m3oInstance } from '../api'

interface ListAPIsResponse {
  apis: any[]
}

interface CreateKeyRequest {
  description: string
  scopes: string[]
  token: string
}

export interface CreateKeyResponse {
  api_key: string
  api_key_id: string
}

enum V1ApisEndpoints {
  generateKey = '/v1/api/keys/generate',
  list = '/publicapi/list',
  createKey = '/v1/api/keys/generate',
}

const createConfig = (token?: string) => ({
  headers: {
    'Micro-Namespace': 'micro',
    authorization: token ? `Bearer ${token}` : '',
  },
})

export async function createKey({
  token,
  ...payload
}: CreateKeyRequest): Promise<CreateKeyResponse> {
  const response = await m3oInstance.post<CreateKeyResponse>(
    V1ApisEndpoints.generateKey,
    payload,
    createConfig(token),
  )

  return response.data
}

export async function listApis(token: string): Promise<string[]> {
  const response = await m3oInstance.post<ListAPIsResponse>(
    V1ApisEndpoints.list,
    {},
    createConfig(token),
  )

  return response.data.apis.map(value => value.name)
}
