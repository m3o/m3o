import type { SchemaObject } from 'openapi3-ts'
import { useQuery, useMutation } from 'react-query'
import { useState } from 'react'
import classNames from 'classnames'
import {
  Select,
  FullSpinner,
  Spinner,
  TextInput,
  Button,
  Tabs,
  CodeBlock,
} from '@/components/ui'
import { useListApis, useM3OClient } from '@/hooks'
import { fetchSingleService } from '@/lib/api/m3o/services/explore'
import { returnFormattedEndpointName, getEndpointName } from '@/utils/api'

type EndpointParamsProps = {
  isLoading: boolean
  schemas: SchemaObject
  selectedEndpoint: string
  onParamChange: (name: string, value: string | number | boolean) => void
}

type PlaygroundResponseSectionProps = {
  data?: Record<string, unknown>
}

function useFetchSelectedApi(selectedApi?: ExploreAPI) {
  const { data: api, isFetching } = useQuery(
    ['playground-api', selectedApi?.display_name],
    () => fetchSingleService(selectedApi!.name),
    {
      enabled: !!selectedApi,
    },
  )

  return {
    api,
    isFetchingApi: isFetching || !api,
  }
}

function EndpointParams({
  isLoading,
  schemas,
  selectedEndpoint,
  onParamChange,
}: EndpointParamsProps) {
  function createParamsTree(properties: SchemaObject) {
    return Object.keys(properties).map(key => {
      const item: SchemaObject = properties[key]

      if (item.type === 'object' && item.properties) {
        return <div>{createParamsTree(item.properties!)}</div>
      }

      if (item.type === 'string' || item.type === 'number') {
        return (
          <TextInput
            name={key}
            label={key}
            placeholder={item.description}
            type={item.type === 'number' ? 'number' : 'text'}
            variant="grey"
            onChange={event =>
              onParamChange(event.target.name, event.target.value)
            }
          />
        )
      }

      return <div>{key}</div>
    })
  }

  if (isLoading) {
    return <Spinner />
  }

  const item = schemas[`${selectedEndpoint}Request`] as SchemaObject

  return (
    <div>
      {item.properties ? (
        createParamsTree(item.properties!)
      ) : (
        <div className="bg-zinc-800 p-6 rounded-md text-sm">
          <p className="font-bold mb-2">Empty payload required:</p>
          {`{}`}
        </div>
      )}
    </div>
  )
}

enum ResponseTabs {
  Response = 'Response',
  CodeSnippets = 'Code Snippet',
}

function PlaygroundResponseSection({ data }: PlaygroundResponseSectionProps) {
  const [currentTab, setCurrentTab] = useState(ResponseTabs.Response)

  function renderButtons() {
    return Object.values(ResponseTabs).map(item => (
      <button
        className="bg-zinc-900 p-4 py-2 rounded-md text-sm mr-4"
        onClick={() => setCurrentTab(item)}
        key={item}>
        {item}
      </button>
    ))
  }

  return (
    <div className="p-8 h-full border-l tbc">
      {renderButtons()}
      {data && (
        <div className="pb-40">
          <CodeBlock code={JSON.stringify(data, null, 2)} language="json" />
        </div>
      )}
    </div>
  )
}

export default function Playground() {
  const m3o = useM3OClient()
  const [requestPayload, setRequestPayload] = useState({})
  const [selectedApi, setSelectedApi] = useState<ExploreAPI | undefined>()
  const [selectedEndpoint, setSelectedEndpoint] = useState('')
  const { data, isLoading } = useListApis()
  const { api, isFetchingApi } = useFetchSelectedApi(selectedApi)

  const runRequestMutation = useMutation(async () => {
    const response = await m3o[api.name][
      getEndpointName(selectedEndpoint.toLowerCase())
    ](requestPayload)

    return response
  })

  if (isLoading || !data) {
    return <FullSpinner />
  }

  function handleParamChange(name: string, value: string | number | boolean) {
    setRequestPayload(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  console.log(runRequestMutation.error)

  return (
    <section className="h-screen overflow-hidden">
      <div className="flex px-6 py-2 items-center justify-between border-b border-zinc-800">
        <Select
          name="selectedApi"
          label="Api"
          onChange={event => {
            const item = data.find(
              item => event.target.value === item.display_name,
            )!

            setSelectedEndpoint('')
            setSelectedApi(item)
          }}
          value={selectedApi?.display_name}
          options={data.map(item => ({
            name: item.display_name,
            value: item.display_name,
          }))}
        />
        <Button
          className="font-mono"
          onClick={() => runRequestMutation.mutate()}
          loading={runRequestMutation.isLoading}>
          Run Request
        </Button>
      </div>
      <div className="py-4 px-6 border-r tbc w-full border-b border-zinc-800">
        <h2 className="font-medium mb-3">Select endpoint:</h2>
        <div className="flex overflow-x-scroll">
          {selectedApi &&
            data
              .find(item => item.display_name === selectedApi.display_name)!
              .endpoints!.map(item => (
                <button
                  onClick={() => {
                    setSelectedEndpoint(item.name)
                    setRequestPayload({})
                    runRequestMutation.reset()
                    runRequestMutation.error = ''
                  }}
                  className={classNames(
                    'block p-4 text-left text-sm font-light rounded-md flex-1 endpoint',
                    {
                      ' text-white bg-zinc-800': item.name === selectedEndpoint,
                      'text-zinc-400': item.name !== selectedEndpoint,
                    },
                  )}>
                  <span className="font-bold block mb-1 font-mono">
                    {returnFormattedEndpointName(item.name)}
                  </span>
                  <span className="block text-xs leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {
                      api?.schemas[`${getEndpointName(item.name)}Request`]
                        .description
                    }
                  </span>
                </button>
              ))}
        </div>
      </div>
      <div className="grid h-screen grid-cols-6 relative">
        <div className="h-full col-span-2">
          <div className="p-8">
            <h2 className="font-bold mb-4">Params</h2>
            {selectedEndpoint && api && (
              <EndpointParams
                key={selectedEndpoint}
                isLoading={isFetchingApi}
                schemas={api.schemas}
                selectedEndpoint={getEndpointName(selectedEndpoint)}
                onParamChange={handleParamChange}
              />
            )}
          </div>
        </div>
        <div className="h-full col-span-3 overflow-scroll">
          <div className="p-8 h-full border-l tbc">
            <button className="bg-zinc-900 p-4 py-2 rounded-md text-sm mr-4">
              Response
            </button>
            <button className="bg-zinc-900 p-4 py-2 rounded-md text-sm">
              Code Snippet
            </button>
            {runRequestMutation.data && (
              <div className="pb-40">
                <CodeBlock
                  code={JSON.stringify(runRequestMutation.data, null, 2)}
                  language="json"
                />
              </div>
            )}
          </div>
          {/* <Tabs>
            <div title="Response">
              {runRequestMutation.error && (
                <p className="border-b border-red-600 p-4 bg-red-500 text-white font-medium">
                  {runRequestMutation.error.detail}
                </p>
              )}

              {runRequestMutation.isLoading && <FullSpinner />}
            </div>
            <div title="JSON">
              <CodeBlock
                code={JSON.stringify(requestPayload, null, 2)}
                language="json"
              />
            </div>
            <div title="Code">
              {selectedApi && selectedEndpoint && api && (
                <CodeBlock
                  code={`
const m3o = require('m3o')(process.env.M3O_API_KEY)

function main() {
  const response = await m3o.${api.name}.${getEndpointName(
                    selectedEndpoint.toLowerCase(),
                  )}(${JSON.stringify(requestPayload, null, 2)})
}

main();
              `}
                  language="javascript"
                />
              )}
            </div>
          </Tabs> */}
        </div>
      </div>
    </section>
  )
}
