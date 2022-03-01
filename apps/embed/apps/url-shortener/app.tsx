import type { FormEvent, ReactElement } from 'react'
import { useState } from 'react'
import { m3oRequest, returnFormValues } from '../shared'

function validateUrl(value: string) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  )
}

export function App(): ReactElement {
  const [hasError, setHasError] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [shortUrl, setShortUrl] = useState('')

  async function handleFormSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    let values = returnFormValues(event.target)
    let isValid = validateUrl(values.url as string)

    setHasError(false)

    if (isValid) {
      let response = await m3oRequest({
        apiName: 'url',
        method: 'shorten',
        data: { destinationURL: values.url }
      })
      setShortUrl(response.shortURL)
    } else {
      setHasError(true)
    }
  }

  async function handleCopiedDblClick(): Promise<void> {
    setHasCopied(true)

    await navigator.clipboard.writeText(shortUrl)

    setTimeout(() => {
      setHasCopied(false)
    }, 1000)
  }

  return (
    <div className="bg-zinc-800 p-10 rounded-lg text-white">
      <h1 className="text-3xl mb-2 font-bold">Shorten your URL</h1>
      {shortUrl ? (
        <div id="url-shortener-result">
          <span
            className="block text-2xl text-zinc-400"
            onDoubleClick={handleCopiedDblClick}
          >
            {shortUrl}
          </span>
          {hasCopied && <span className="mt-4 block text-xs">Copied</span>}
        </div>
      ) : (
        <>
          <form className="w-full" onSubmit={handleFormSubmit}>
            <div className="flex items-center w-full ">
              <input
                type="text"
                className="my-6 p-4 mr-4 border-none bg-zinc-700 rounded-md placeholder:text-zinc-600 grow"
                name="url"
                placeholder="https://m3o.com"
              />
              <button className="bg-indigo-600 p-4 rounded-lg w-44">Go!</button>
            </div>
          </form>
          {hasError && (
            <p id="url-shortener-error">Please provide a valid URL</p>
          )}
        </>
      )}
    </div>
  )
}
