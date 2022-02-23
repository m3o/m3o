async function helloWorldCall(name) {
  const response = await fetch(`https://api.m3o.com/v1/helloworld/Call`, {
    method: 'POST',
    body: JSON.stringify({ name }),
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

const form = document.getElementById('hello-world-form')
const input = document.getElementById('hello-world-input')
const result = document.getElementById('hello-world-result')

form.onsubmit = async function handleSubmit(event) {
  event.preventDefault()
  const response = await helloWorldCall(input.value)
  result.textContent = response.message
}
