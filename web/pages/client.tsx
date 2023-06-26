import type { SchemaObject } from 'openapi3-ts'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useQuery } from 'react-query'
import { useState, useEffect, useMemo } from 'react'
import { MainLayout } from '@/components/layouts'
import { FullSpinner, Spinner, TextInput, Button } from '@/components/ui'
import { useListApis, usePlaygroundService } from '@/hooks'
import { fetchSingleService } from '@/lib/api/m3o/services/explore'
import { getEndpointName } from '@/utils/api'
import { Modal, LinkButton } from '@/components/ui'
import { REDIRECT_TO_KEY } from '@/lib/constants'
import {
  Output,
  ServicesSidebar,
  Endpoint,
} from '@/components/pages/Playground'
import { OutputTypes } from '@/lib/constants'
import { withAuth } from '@/lib/api/m3o/withAuth'
import type { WithAuthProps } from '@/lib/api/m3o/withAuth'

type EndpointParamsProps = {
  isLoading: boolean
  schemas: SchemaObject
  selectedEndpoint: string
  onParamChange: (name: string, value: string | number | boolean) => void
}

export const getServerSideProps = withAuth(async context => {
  return {
    props: {
      user: context.req.user,
    },
  }
})

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
        <div className="rounded-md text-sm mb-2">
          <p>No params required</p>
        </div>
      )}
    </div>
  )
}

export default function Playground({ user }: WithAuthProps) {
  const router = useRouter()
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

  return (
    <>
      <NextSeo
        title="Client"
        description="Run, test and use M3O APIs"
        canonical="https://m3o.com/client"
      />
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
                    <div className="grid grid-cols-6 overflow-hidden flex-grow">
                      <div className="col-span-2 border-r border-zinc-800 p-6">
                        {selectedEndpoint && api && (
                          <EndpointParams
                            key={selectedEndpoint}
                            isLoading={isFetchingApi}
                            schemas={api.schemas}
                            selectedEndpoint={getEndpointName(selectedEndpoint)}
                            onParamChange={handleParamChange}
                          />
                        )}
                          <Button
                            className="font-mono text-sm"
                            onClick={() => run.mutate(api?.name)}
                            loading={run.isLoading}
                            disabled={isFetchingApi}>
                            Submit
                          </Button>
                      </div>
                      <div className="col-span-4 overflow-scroll flex flex-col">
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
                <p>
                  Select an API to get started
                </p>
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </>
  )
}
