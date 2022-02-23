import type { SchemaObject } from 'openapi3-ts'
import type { FC } from 'react'
import type { ServiceExamples } from '@/types'
import Link from 'next/link'
import { RequestBlock, SubTitle } from '@/components/ui'
import { useSelectLanguage } from '@/hooks'
import { returnFormattedEndpointName } from '@/utils/api'

interface Props {
  apiName: string
  examples: ServiceExamples
  requestSchema: SchemaObject
}

export const Example: FC<Props> = ({ apiName, examples, requestSchema }) => {
  const selectLanguage = useSelectLanguage()

  return (
    <>
      <SubTitle className="mt-6">Example</SubTitle>
      <p className="mb-4">
        Please see an example of how to get started with the{' '}
        <span className="capitalize">{apiName}</span> api.
      </p>
      <p className="mb-6">
        For a more detailed view please see the{' '}
        <Link href={`/${apiName}/api`}>
          <a>API page</a>
        </Link>
      </p>
      <RequestBlock
        {...selectLanguage}
        examples={examples}
        apiName={apiName}
        requestSchema={requestSchema}
        title={returnFormattedEndpointName(requestSchema.title || '')}
      />
    </>
  )
}
