import type { ReactElement } from 'react'
import type { ListResponse, Service } from 'm3o/app'
import { useState, useEffect } from 'react'
import { m3oRequest, returnFormValues } from '../shared'
import { Status } from './status'

export function App(): ReactElement {
  const [apps, setApps] = useState<Service[]>([])

  useEffect(() => {
    ;(async () => {
      let response: ListResponse = await m3oRequest({
        apiName: 'app',
        method: 'List',
        data: {}
      })

      setApps(response.services || [])
    })()
  }, [])

  return (
    <div className="bg-zinc-900 p-10 rounded-lg text-white font-light">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl">Apps</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-lg transition-colors">
          Add
        </button>
      </div>
      {apps.length ? (
        apps.map((app) => (
          <div className="p-6 rounded-md bg-zinc-800">
            <div className=" pb-4 flex justify-between items-center">
              <div>
                <h2 className="mb-3">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold hover:underline text-lg"
                  >
                    {app.name}
                  </a>
                </h2>
                <Status status={app.status as AppStatus} />
                <h3 className="mt-3 text-sm">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-zinc-300"
                  >
                    {app.url?.replace('https://', '')}
                  </a>
                </h3>
              </div>
              {/* {headerRight} */}
            </div>
            {/* <div className="pt-4 text-zinc-300">
              {KEYS.map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-2 mb-2 last:mb-0 bg-zinc-700 py-2 px-4 rounded-md"
                >
                  <p className="text-sm capitalize">{key}</p>
                  <p className="text-sm text-ellipsis overflow-hidden">
                    {props[key]}
                  </p>
                </div>
              ))}
            </div> */}
          </div>
        ))
      ) : (
        <div>No Results</div>
      )}
    </div>
  )
}
