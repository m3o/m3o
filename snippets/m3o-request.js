/**
 * M3O Request Snippet
 * -------------------------
 *
 * Use the code below to make http requests to a M3O
 * API without the need for libraries or installs.
 */

// 1. Get your m3o. This should come from an environment variable to keep secret from the public
const key = process.env.M3O_KEY

// 2. Use this code to make requests to the m3o api
async function m3oRequest(apiName, apiMethod, data) {
  const response = await fetch(
    `https://api.m3o.com/v1/${apiName}/${apiMethod}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      }
    }
  )

  const result = await response.json()

  if (response.ok) {
    return result
  }

  return Promise.reject(result)
}

// 3. Make a request to any of the M3O apis. In this example we will weather:
async function weatherNow() {
  const response = await m3oRequest('weather', 'Now', {
    location: 'London'
  })

  console.log(response)
}

weatherNow()
