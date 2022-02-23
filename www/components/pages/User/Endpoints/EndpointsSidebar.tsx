import type { FC } from 'react'
import { Fragment } from 'react'
import { getEndpointName } from '@/utils/api'
import { ExampleButton } from './ExampleButton'

export interface ExampleClickValues {
  endpointName: string
  endpointExampleName: string | ''
}

interface Props {
  endpoints: Endpoint[]
  examples: ParsedExamples
  onExampleSelect: (values: ExampleClickValues) => void
  selected: ExampleClickValues
}

export const EndpointsSidebar: FC<Props> = ({
  endpoints,
  examples,
  onExampleSelect,
  selected,
}) => {
  return (
    <aside className="border-r border-zinc-300 border-solid w-3/12">
      <div className="p-4 bg-zinc-50">Request</div>
      {endpoints.map(endpoint => {
        const endpointName = getEndpointName(endpoint.name)
        const endpointExamples = examples[endpointName.toLowerCase()] || []

        return (
          <Fragment key={endpoint.name}>
            <h4 className="p-4 font-bold text-black text-lg">{endpointName}</h4>
            <ExampleButton
              onClick={() =>
                onExampleSelect({
                  endpointExampleName: '',
                  endpointName: endpoint.name,
                })
              }
              selected={
                selected.endpointName === endpoint.name &&
                selected.endpointExampleName === ''
              }>
              Blank example
            </ExampleButton>
            {!!endpointExamples.length &&
              endpointExamples.map(example => (
                <ExampleButton
                  key={example.title}
                  onClick={() =>
                    onExampleSelect({
                      endpointName: endpoint.name,
                      endpointExampleName: example.title,
                    })
                  }
                  selected={
                    selected.endpointName === endpoint.name &&
                    selected.endpointExampleName === example.title
                  }>
                  {example.title}
                </ExampleButton>
              ))}
          </Fragment>
        )
      })}
    </aside>
  )
}
