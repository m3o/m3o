import type { SchemaObject } from 'openapi3-ts'
import type { NextPage } from 'next'
import { useState } from 'react'
import { ApiLayout } from '@/components/layouts'
import { EndpointCard } from '@/components/pages/Api'
import { fetchSingleService } from '@/lib/api/m3o/services/explore'
import {
  getEndpointName,
  returnFormattedEndpointName,
  getPrice,
} from '@/utils/api'
import { lowercaseFirstLetter } from '@/utils/helpers'
import { withAuth, WithAuthProps } from '@/lib/api/m3o/withAuth'
import { Languages, FormattedService } from '@/types'

interface ReturnSchemaProps {
  key: string
  method: 'Request' | 'Response'
  schemas: SchemaObject
}

interface Props extends WithAuthProps, FormattedService {}

function returnSchema({
  key,
  method,
  schemas,
}: ReturnSchemaProps): SchemaObject {
  const formattedKey = getEndpointName(key)
  return schemas[`${formattedKey}${method}`] as SchemaObject
}

export const getServerSideProps = withAuth(async context => {
  const api = await fetchSingleService(context.params!.api as string)

  return {
    props: {
      ...api,
      user: context.req.user,
    },
  }
})

const Api: NextPage<Props> = ({
  category,
  display_name,
  user,
  endpoints,
  examples,
  name,
  pricing,
  schemas,
  summaryDescription,
}) => {
  const [chosenLanguage, setChosenLanguage] = useState<Languages>('bash')

  function returnResponsePayload(endpoint: Endpoint) {
    const example =
      examples[lowercaseFirstLetter(getEndpointName(endpoint.name))]

    return example ? example[0].response : {}
  }

  return (
    <ApiLayout
      displayName={display_name}
      name={name}
      category={category}
      contentClassName="pt-6 pb-6"
      summaryDescription={summaryDescription}
      user={user}>
      <div className="px-20 pb-8 font-medium border-b tbc">
        <h1 className="font-medium text-3xl md:text-5xl">{display_name}</h1>
      </div>

      {endpoints.map(endpoint => {
        return (
          <EndpointCard
            examples={examples}
            apiName={name}
            apiMethod="POST"
            apiVersion="v1"
            endpointName={getEndpointName(endpoint.name)}
            language={chosenLanguage}
            title={returnFormattedEndpointName(endpoint.name)}
            key={endpoint.name}
            price={getPrice({ key: endpoint.name, pricing })}
            onLanguageChange={setChosenLanguage}
            requestSchema={returnSchema({
              key: endpoint.name,
              method: 'Request',
              schemas,
            })}
            responseSchema={returnSchema({
              key: endpoint.name,
              method: 'Response',
              schemas,
            })}
            responsePayload={returnResponsePayload(endpoint)}
          />
        )
      })}
    </ApiLayout>
  )
}

export default Api
