import type { SchemaObject } from 'openapi3-ts'
import { useQuery, useMutation } from 'react-query'
import { useState, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import { MainLayout } from '@/components/layouts'
import { FullSpinner, Spinner, TextInput, Button } from '@/components/ui'
import { useListApis, usePlaygroundService } from '@/hooks'
import { fetchSingleService } from '@/lib/api/m3o/services/explore'
import { returnFormattedEndpointName, getEndpointName } from '@/utils/api'
import {
  Output,
  ServicesSidebar,
  Endpoint,
} from '@/components/pages/Playground'
import { OutputTypes } from '@/lib/constants'

type EndpointParamsProps = {
  isLoading: boolean
  schemas: SchemaObject
  selectedEndpoint: string
  onParamChange: (name: string, value: string | number | boolean) => void
}

function useFetchSelectedApi(selectedApi: string) {
  const { data: api, isFetching } = useQuery(
    ['playground-api', selectedApi],
    () => fetchSingleService(selectedApi),
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
        return <div key={key}>{createParamsTree(item.properties!)}</div>
      }

      if (item.type === 'string' || item.type === 'number') {
        return (
          <TextInput
            name={key}
            label={key}
            key={key}
            placeholder={item.description}
            type={item.type === 'number' ? 'number' : 'text'}
            variant="grey"
            onChange={event =>
              onParamChange(event.target.name, event.target.value)
            }
          />
        )
      }

      return null
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

export default function Playground() {
  const [selectedApi, setSelectedApi] = useState('')
  const [currentTab, setCurrentTab] = useState(OutputTypes.Response)
  const { data, isLoading } = useListApis()
  const { api, isFetchingApi } = useFetchSelectedApi(selectedApi)
  const { setSelectedEndpoint, setRequestPayload, selectedEndpoint, run } =
    usePlaygroundService()

  useEffect(() => {
    if (data && selectedApi && !selectedEndpoint) {
      const item = data.find(item => item.name === selectedApi)!
      setSelectedEndpoint(item.endpoints![0].name)
    }
  }, [selectedApi, data, selectedEndpoint])

  const endpoints = useMemo(() => {
    if (!selectedApi || !data) return null

    return data
      .find(item => item.name === selectedApi)!
      .endpoints!.map(item => (
        <Endpoint
          key={item.name}
          onClick={() => {
            setSelectedEndpoint(item.name)
            setRequestPayload({})
            run.reset()
            run.error = ''
          }}
          isSelected={item.name === selectedEndpoint}
          description={
            api?.schemas[`${getEndpointName(item.name)}Request`].description
          }
          name={item.name}
        />
      ))
  }, [data, selectedApi, api, selectedEndpoint])

  if (isLoading || !data) {
    return (
      <MainLayout>
        <FullSpinner />
      </MainLayout>
    )
  }

  function handleParamChange(name: string, value: string | number | boolean) {
    setRequestPayload(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  console.log(run.error)

  return (
    <MainLayout>
      <section className="h-screen overflow-hidden grid grid-cols-6">
        <ServicesSidebar
          data={data}
          onSelectService={name => {
            setSelectedApi(name)
            setRequestPayload({})
            setSelectedEndpoint('')
            run.reset()
            run.error = ''
          }}
          selectedService={selectedApi}
        />
        <div className="col-span-5 flex flex-col overflow-hidden">
          {selectedApi ? (
            <>
              <div className="py-2 px-6 border-b border-zinc-800 w-full">
                <div className="flex overflow-x-scroll">{endpoints}</div>
              </div>
              {selectedEndpoint && (
                <>
                  <div className="flex justify-between border-b border-zinc-800 items-center px-6 py-2">
                    <div>
                      <p className="text-sm text-zinc-400">
                        <span className="inline-block mr-3 bg-zinc-800 p-2 rounded-md text-indigo-300 text-xs">
                          POST
                        </span>
                        {process.env.NEXT_PUBLIC_API_URL}/{selectedApi}/
                        {selectedEndpoint.split('.')[1]}
                      </p>
                    </div>
                    <Button
                      className="font-mono text-sm"
                      onClick={() => run.mutate(api?.name)}
                      loading={run.isLoading}
                      disabled={isFetchingApi}>
                      Run Request
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 overflow-hidden flex-grow">
                    <div className="border-r border-zinc-800 p-6">
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
                    <div className="col-span-3 overflow-scroll flex flex-col">
                      <Output
                        data={run.data}
                        error={
                          run.error
                            ? (run.error as { detail: string }).detail
                            : ''
                        }
                        isFetching={run.isLoading}
                        key={selectedApi}
                        currentTab={currentTab}
                        onTabClick={setCurrentTab}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full uppercase ">
              <p className="text-zinc-400">
                Please select an API to get started
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}
