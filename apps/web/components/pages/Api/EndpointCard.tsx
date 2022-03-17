import type { SchemaObject } from 'openapi3-ts'
import type { Languages, ServiceExamples } from '@/types'
import { FC } from 'react'
import { splitEndpointTitle } from '@/utils/api'
import { RequestBlock, ResponseBlock, Card } from '@/components/ui'
import { PropertiesTable } from './PropertiesTable'

interface Props {
  apiName: string
  apiMethod: string
  apiVersion: string
  endpointName: string
  examples: ServiceExamples
  language: Languages
  onLanguageChange: (language: Languages) => void
  price: string
  requestSchema?: SchemaObject
  responseSchema?: SchemaObject
  responsePayload: Record<string, unknown>
  title: string
}

export const EndpointCard: FC<Props> = ({
  apiName,
  apiMethod,
  apiVersion,
  endpointName,
  examples,
  language,
  onLanguageChange,
  price,
  requestSchema,
  responseSchema,
  responsePayload,
  title,
}) => {
  return (
    <div className="border-b tbc last:border-0 pt-6 first:pt-0 md:py-10 lg:py-20">
      <div
        className="md:grid md:grid-cols-2 api-max-width"
        id={title.replace(/ /g, '')}>
        <div className="px-6 md:px-10 lg:px-20 pb-4">
          <h4 className="mb-4 inline-block text-xs">
            <span className="font-medium text-indigo-400">{apiMethod}</span>{' '}
            <span className="text-sm text-zinc-400">
              /{apiVersion}/{apiName}/{endpointName}
            </span>
          </h4>
          <h3 className="font-medium text-black text-3xl dark:text-white mb-2">
            {splitEndpointTitle(title)}
          </h3>
          {requestSchema && (
            <p className="text-zinc-400 mb-10 max-w-md">
              {requestSchema.description}
            </p>
          )}
          <PropertiesTable
            title="Request"
            properties={requestSchema?.properties}
          />
          <PropertiesTable
            title="Response"
            properties={responseSchema?.properties}
          />
        </div>
        <div className="px-6 pb-6">
          {requestSchema && (
            <RequestBlock
              examples={examples}
              requestSchema={requestSchema}
              apiName={apiName}
              onLanguageChange={onLanguageChange}
              language={language}
            />
          )}
          {responseSchema && (
            <ResponseBlock code={JSON.stringify(responsePayload, null, 4)} />
          )}
        </div>
      </div>
    </div>
  )
}
