import type { NextPage } from 'next'
import { useState } from 'react'
import { ApiLayout } from '@/components/layouts'
import { fetchSingleService } from '@/lib/api/m3o/services/explore'
import { Endpoints, EndpointItem } from '@/components/pages/User'
import { withAuth, WithAuthProps } from '@/lib/api/m3o/withAuth'
import { FormattedService, FormattedEndpoint } from '@/types'
import { lowercaseFirstLetter } from '@/utils/helpers'
import { schemaToJSON, returnFormattedEndpointName } from '@/utils/api'
import { CategoryBubble } from '@/components/ui'

interface Props extends WithAuthProps, FormattedService {
  formattedEndpoints: FormattedEndpoint[]
}

type CreateEndpointsData = Pick<
  FormattedService,
  'examples' | 'paths' | 'schemas'
>

function createEndpointsData({
  examples,
  paths,
  schemas,
}: CreateEndpointsData) {
  return Object.keys(paths)
    .map(item => /[^/]*$/.exec(item)![0])
    .map(
      key =>
        ({
          title: returnFormattedEndpointName(key),
          examples: [
            {
              title: 'Blank',
              request: JSON.parse(schemaToJSON(schemas[`${key}Request`])),
            },
            ...(examples[lowercaseFirstLetter(key)].map(item => ({
              title: item.title,
              request: item.request,
            })) || []),
          ],
        } as FormattedEndpoint),
    )
}

export const getServerSideProps = withAuth(async context => {
  const api = await fetchSingleService(context.params!.api as string)

  const formattedEndpoints = createEndpointsData({
    examples: api.examples,
    paths: api.paths,
    schemas: api.schemas,
  })

  return {
    props: {
      ...api,
      user: context.req.user,
      formattedEndpoints,
    },
  }
})

const Console: NextPage<Props> = ({
  formattedEndpoints,
  display_name,
  user,
  name,
  category,
  description,
  schemas,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointItem>({
    name: 'Blank',
    endpoint: formattedEndpoints[0].title,
  })

  return (
    <ApiLayout
      displayName={display_name}
      name={name}
      category={category}
      summaryDescription={description}
      user={user}>
      <div className="px-6 md:px-10 lg:px-20 pb-8 font-medium">
        <CategoryBubble className="inline-block mb-4">
          {category}
        </CategoryBubble>
        <h1 className="font-medium text-2xl md:text-3xl">{display_name}</h1>
      </div>
      <div className="px-6 md:px-10 lg:px-20">
        <Endpoints
          onEndpointClick={setSelectedEndpoint}
          selectedEndpoint={selectedEndpoint}
          schemas={schemas}
          formattedEndpoints={formattedEndpoints}
          service={name}
        />
      </div>
    </ApiLayout>
  )
}

export default Console
