import type { FC } from 'react'
import type { FormattedEndpoint } from '@/types'
import { Fragment } from 'react'
import { EndpointButton } from './EndpointButton'

interface EndpointClickPayload {
  endpoint: string
  name: string
}

interface Props {
  examples: FormattedEndpoint['examples']
  title: string
  onExampleClick: (payload: EndpointClickPayload) => void
  selectedEndpoint: string
  selectedExample: string
}

export const Endpoint: FC<Props> = ({
  examples = [],
  title,
  onExampleClick,
  selectedEndpoint,
  selectedExample,
}) => {
  return (
    <Fragment>
      <h4 className="p-4 font-medium text-black text-lg dark:text-white">
        {title}
      </h4>
      {examples.map(example => (
        <EndpointButton
          selected={
            title === selectedEndpoint && selectedExample === example.title
          }
          key={example.title}
          onClick={() =>
            onExampleClick({
              endpoint: title,
              name: example.title,
            })
          }>
          {example.title}
        </EndpointButton>
      ))}
    </Fragment>
  )
}
