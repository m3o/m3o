import type { FormEvent } from 'react';
import { render } from 'react-dom';
import { useRef, useState } from 'react'

async function helloWorldCall(name: string) {
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

function HelloWorld() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState()

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await helloWorldCall(inputRef.current?.value)
      setResult(response.message)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="bg-zinc-800 p-10 rounded-lg text-white font-light">
      <h1 className="text-4xl">👋 Hello world</h1>
      <form id="hello-world-form" onSubmit={onSubmit}>
        <p className="text-zinc-300 mt-4">
          What is the person's name you like to say hello too?
        </p>
        <div className="flex items-center">
          <input
            type="text"
            id="hello-world-input"
            className="my-6 p-4 mr-4 border-none bg-zinc-700"
            ref={inputRef}
          />
          <button className="bg-indigo-600 p-4 rounded-lg">Submit</button>
        </div>
      </form>
      {result && (
        <p>{result}</p>
      )}
    </div>
  )
}

render(<HelloWorld />, document.getElementById('root'))

