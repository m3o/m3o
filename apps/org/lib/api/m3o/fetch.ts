async function request<T>(path: string, config: RequestInit): Promise<T> {
  const request = new Request(
    `${process.env.NEXT_PUBLIC_API_URL}${path}`,
    config,
  )
  const response = await fetch(request)
  const json = await response.json()

  if (!response.ok) {
    return Promise.reject(json)
  }

  return json
}

export function get<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: 'GET', ...config }
  return request<T>(path, init)
}

export async function post<T, U>(
  path: string,
  body: T,
  config?: RequestInit,
): Promise<U> {
  const init = {
    method: 'POST',
    body: JSON.stringify(body),
    ...config,
  }
  return request<U>(path, init)
}

export function put<T, U>(
  path: string,
  body: T,
  config?: RequestInit,
): Promise<U> {
  const init = { method: 'PUT', body: JSON.stringify(body), ...config }
  return request<U>(path, init)
}
