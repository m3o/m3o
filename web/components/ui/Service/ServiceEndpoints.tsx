import type { FC } from 'react'
import { Fragment } from 'react'
import { returnFormattedEndpointName, getEndpointName } from '@/utils/api'

interface Props {
  endpoints: ExploreAPI['endpoints']
  serviceName: string
}

export const ServiceEndpoints: FC<Props> = ({
  endpoints = [],
  serviceName,
}: Props) => {
  return (
    <div className="p-6 mt-2 text-sm relative z-30">
      {endpoints.slice(0, 3).map((endpoint, index) => (
        <Fragment key={`endpoint-${index}`}>
          <a
            className="text-blue-600 hover:underline dark:text-blue-300 pointer-events-auto"
            href={`/${serviceName}/api#${getEndpointName(endpoint.name)}`}>
            {returnFormattedEndpointName(endpoint.name)}
            {index !== endpoints.length - 1 && (
              <span className="inline-block mx-1">&bull;</span>
            )}
          </a>
        </Fragment>
      ))}
      {endpoints.length > 3 && (
        <span className="inline-block ml-1 text-zinc-300">&amp; more</span>
      )}
    </div>
  )
}
