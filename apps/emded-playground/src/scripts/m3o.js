export async function m3o(apiName, apiMethod, data) {
  const response = await fetch(
    `https://api.m3o.com/v1/${apiName}/${apiMethod}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer MDQ3Nzk5YWQtOWM5OS00OTIzLWE4MTItMzA4MTMzMzY0OTc1`
      }
    }
  )

  const result = await response.json()

  if (response.ok) {
    return result
  }

  return Promise.reject(result)
}
