export async function m3oRequest({apiName, method, data}) {
  const response = await fetch(`https://api.m3o.com/v1/${apiName}/${method}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer NmZkYjc1OWMtMjMwNi00OTkyLTk3MzMtNzQ0YWU0NjQ4NDZj`
    }
  })

  const result = await response.json()

  if (response.ok) {
    return result
  }

  return Promise.reject(result)
}

export function returnFormValues(form) {
  return Object.fromEntries([...new FormData(form)])
}