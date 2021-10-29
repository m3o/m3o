const BASE_URL = '/api/';

export async function post<R, D = {}>(url: string, values: D): Promise<R> {
  const response = await fetch(`${BASE_URL}${url}`, {
    body: JSON.stringify(values),
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (response.status > 201) {
    throw result;
  }

  return result;
}

export async function get<R>(url: string): Promise<R> {
  const response = await fetch(`${BASE_URL}${url}`);
  const result = await response.json();

  if (response.status > 201) {
    throw result;
  }

  return result;
}
