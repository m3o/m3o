import type { FC } from 'react'
import type { SchemaObject } from 'openapi3-ts'
import type { ServiceExamples } from '@/types'
import { RequestBlock } from '@/components/ui'
import { useUser } from '@/providers'
import { useV1Token, useSelectLanguage } from '@/hooks'

interface Props {
  examples: ServiceExamples
  requestSchema: SchemaObject
}

export const Example: FC<Props> = ({ examples, requestSchema }) => {
  const v1Token = useV1Token()
  const selectLanguage = useSelectLanguage()
  const user = useUser()

  return (
    <>
      <RequestBlock
        {...selectLanguage}
        apiName="helloworld"
        examples={examples}
        requestSchema={requestSchema}
        title="Hello World example"
        token={user ? v1Token : ''}
      />
    </>
  )
}
