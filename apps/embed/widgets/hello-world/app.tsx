import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react'
import { m3oRequest, returnFormValues } from '../shared'

export function App(): ReactElement {
  const [result, setResult] = useState('');

  async function handleSubmit (event: FormEvent): Promise<void> {
    event.preventDefault();

    let { name } = returnFormValues(event.target)
    let response = await m3oRequest({
      apiName: 'helloworld',
      method: 'Call',
      data: { name }
    })

    setResult(response.message)
  }


  return (
    <div className="bg-zinc-800 p-10 rounded-lg text-white font-light">
      <h1 className="text-4xl">👋 Hello world</h1>
      <form onSubmit={handleSubmit}>
        <p className="text-zinc-300 mt-4">
          What is the person's name you like to say hello too? rrr
        </p>
        <div className="flex items-center">
          <input
            type="text"
            className="my-6 p-4 mr-4 border-none bg-zinc-700"
            name="name"
          />
          <button className="bg-indigo-600 p-4 rounded-lg">Submit</button>
        </div>
      </form>
      {result && <p>{result}</p>}
    </div>
  )
}