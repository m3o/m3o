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
      {/* <SubTitle className="mt-6">Example</SubTitle>
      <p className="mb-6">
        For more examples see the{' '}
        <Link href={`/${apiName}/api`}>
          <a>API Reference</a>
        </Link>
      </p> */}
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
