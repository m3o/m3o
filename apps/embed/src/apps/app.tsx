import type { ListResponse, Service } from 'm3o/app'
import { useState, useEffect } from 'react'
import { m3oRequest } from '../shared'
import { M3OApp, M3OApps } from 'ui'

export function App() {
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
    <div className="bg-zinc-900 p-10 rounded-lg text-white font-light min-h-full app">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl">Apps</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-lg transition-colors">
          Add
        </button>
      </div>
      <M3OApps />
      {apps.length ? (
        apps.map((app) => <M3OApp {...app} key={app.id} headerRight="Hello" />)
      ) : (
        <div>No Results</div>
      )}
    </div>
  )
}
