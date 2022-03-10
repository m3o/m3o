import { useQuery } from 'react-query'
import { useState, useMemo } from 'react'
import { exploreServices } from '@/lib/api/m3o/services/explore'
import dynamic from 'next/dynamic'
import { useM3OClient } from '@/hooks'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/editor'),
  { ssr: false },
)

import { Spinner } from '@/components/ui'

const INITIAL_CODE = `{

}`

export default function Playground() {
  const m3o = useM3OClient()
  const [selectedApi, setSelectedApi] = useState('')
  const [selectedEndpoint, setSelectedEndpoint] = useState('')
  const [jsonResponse, setResponse] = useState('')
  const [code, setCode] = useState(INITIAL_CODE)

  const { data, isLoading } = useQuery('playground-explore', () =>
    exploreServices(),
  )

  const endpoints = useMemo(() => {
    if (!selectedApi || !data) return []

    return data
      .find(item => item.name === selectedApi)!
      .endpoints.map(item => {
        const { 1: name } = item.name.split('.')
        return name
      })
  }, [selectedApi, data])

  async function call() {
    console.log(selectedApi, selectedEndpoint)
    const response = await m3o[selectedApi][selectedEndpoint.toLowerCase()](
      JSON.parse(code),
    )
    setResponse(JSON.stringify(response, null, 2))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="grid grid-cols-2">
      <div>
        {/* Header */}
        <div className="p-2">
          <select
            name=""
            id=""
            value={selectedApi}
            onChange={event => setSelectedApi(event.target.value)}>
            <option value="">Please select</option>
            {data?.map(item => (
              <option value={item.name} key={item.name}>
                {item.display_name}
              </option>
            ))}
          </select>
          <select
            name=""
            id=""
            disabled={!selectedApi}
            onChange={event => setSelectedEndpoint(event.target.value)}
            value={selectedEndpoint}>
            <option value="">Please select</option>
            {endpoints.map(item => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <button onClick={call}>Send</button>
        </div>
        {/* Request block */}
        <div>
          <h3>Request Body</h3>
          <DynamicComponentWithNoSSR onChange={setCode} value={code} />
        </div>
        <div>Code</div>
      </div>
      <div>
        <DynamicComponentWithNoSSR
          onChange={console.log}
          value={jsonResponse}
        />
      </div>
    </div>
  )
}
