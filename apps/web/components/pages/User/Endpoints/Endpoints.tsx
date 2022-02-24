import type { FC } from 'react'
import type { FormattedService, FormattedEndpoint } from '@/types'
import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Endpoint } from './Endpoint'
import { EndpointCaller } from './EndpointCaller'
import { useCallV1Api, useV1Token } from '@/hooks'
import { stringifyAndFormatJSON } from '@/utils/text'
import { sessionStorage } from '@/utils/storage'
import { Alert } from '@/components/ui'
import { Routes, SessionStorageKeys } from '@/lib/constants'

export interface EndpointItem {
  name: string
  endpoint: string
}

interface Props {
  service: string
  onEndpointClick: (item: EndpointItem) => void
  selectedEndpoint: EndpointItem
  schemas: FormattedService['schemas']
  formattedEndpoints: FormattedEndpoint[]
}

export const Endpoints: FC<Props> = ({
  onEndpointClick,
  selectedEndpoint,
  formattedEndpoints,
  service,
}) => {
  const v1ApiToken = useV1Token()
  const router = useRouter()
  const callV1Api = useCallV1Api()

  const selected = useMemo(() => {
    const endpoint = formattedEndpoints.find(item => {
      return item.title === selectedEndpoint.endpoint
    })!

    return endpoint.examples.find(item => item.title === selectedEndpoint.name)!
  }, [formattedEndpoints, selectedEndpoint])

  const [requestString, setRequestString] = useState(
    stringifyAndFormatJSON(selected.request),
  )

  useEffect(() => {
    setRequestString(stringifyAndFormatJSON(selected.request))
  }, [selected])

  const onRunClick = () => {
    if (v1ApiToken) {
      callV1Api.mutate({
        service,
        endpoint: selectedEndpoint.endpoint,
        json: JSON.parse(requestString),
      })
    } else {
      sessionStorage.setItem(
        SessionStorageKeys.RedirectToAfterLogin,
        router.asPath,
      )
      router.push(Routes.Login)
    }
  }

  function handleRequestChange(value: string = '') {
    setRequestString(value)
  }

  return (
    <section className="bg-white rounded-md border border-zinc-300 border-solid my-6 dark:bg-zinc-900 dark:border-zinc-600">
      {callV1Api.error && (
        <Alert type="error">{callV1Api.error as string}</Alert>
      )}
      <div className="md:flex">
        <aside className="border-zinc-300 border-solid border-b w-full md:w-3/12 p-4 md:border-b-0 md:border-r dark:border-zinc-600">
          {formattedEndpoints.map(endpoint => (
            <Endpoint
              key={endpoint.title}
              title={endpoint.title}
              selectedEndpoint={selectedEndpoint.endpoint}
              selectedExample={selectedEndpoint.name}
              onExampleClick={onEndpointClick}
              examples={endpoint.examples}
            />
          ))}
        </aside>
        <div className="w-full md:w-9/12">
          <EndpointCaller
            endpoint={selected}
            onRunClick={onRunClick}
            response={callV1Api.data}
            handleRequestChange={handleRequestChange}
          />
        </div>
      </div>
    </section>
  )
}
