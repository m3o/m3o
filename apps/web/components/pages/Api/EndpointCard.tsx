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
    <>
      <div
        className="grid grid-cols-2 border-b tbc last:border-0 pt-20 first:pt-0"
        style={{ maxWidth: 1600 }}
        id={title.replace(/ /g, '')}>
        <div className="px-20 pb-20">
          <h4 className="mb-4  inline-block text-xs">
            <span className="font-medium text-indigo-400">{apiMethod}</span>{' '}
            <span className="text-sm text-zinc-400">
              /{apiVersion}/{apiName}/{endpointName}
            </span>
          </h4>
          <h3 className="font-medium text-black text-4xl dark:text-white mb-2">
            {splitEndpointTitle(title)}
          </h3>
          {requestSchema && (
            <p className="max-w-x mt-4  text-zinc-400 mb-10 max-w-lg">
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
        <div className="p-10">
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
      {/* <div className="mb-4 border-b tbc pb-10 pt-6 first:pt-0 last:border-b-0">
        <div className="pb-4 mb-8 flex justify-between">
          <div></div>
          <p className="block text-sm font-medium text-indigo-600 dark:text-indigo-300">
            {price} {price === 'Free' ? '' : 'credits'}
          </p>
        </div>
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div></div>
          <div></div>
        </div>
      </div> */}
    </>
  )
}
