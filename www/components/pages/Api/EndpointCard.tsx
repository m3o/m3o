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
    <Card className="p-4 md:p-6 mb-4" id={title.replace(/ /g, '')}>
      <div className="border-b pb-4 mb-8 border-zinc-100 dark:border-zinc-700 flex justify-between">
        <div>
          <h3 className="font-bold text-black text-2xl dark:text-white">
            {splitEndpointTitle(title)}
          </h3>
          <h4 className="pt-2">
            <span className="font-bold text-green-800">{apiMethod}</span>{' '}
            <span className="text-sm text-zinc-400">/{apiVersion}/{apiName}/{endpointName}</span>
          </h4>
          {requestSchema && (
            <p className="max-w-x mt-4 max-w-2xl">
              {requestSchema.description}
            </p>
          )}
        </div>
        <p className="block text-sm font-medium text-indigo-600 dark:text-indigo-300">
          {price} {price === 'Free' ? '' : 'per request'}
        </p>
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-6">
        <div>
          <PropertiesTable
            title="Request"
            properties={requestSchema?.properties}
          />
          <PropertiesTable
            title="Response"
            properties={responseSchema?.properties}
          />
        </div>
        <div>
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
    </Card>
  )
}
