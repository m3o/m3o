import type { NextPage } from 'next'
import type { SchemaObject } from 'openapi3-ts'
import { ApiLayout } from '@/components/layouts'
import { fetchSingleService } from '@/lib/api/m3o/services/explore'
import { withAuth, WithAuthProps } from '@/lib/api/m3o/withAuth'
import { getEndpointName, createFeaturesTableData } from '@/utils/api'
import { FeatureItem, FormattedService } from '@/types'
import {
  Features,
  Example,
  NeedHelp,
  Licenses,
  OverviewDescription,
} from '@/components/pages/Api'
import { ResponseBlock, SubTitle } from '@/components/ui'
import { lowercaseFirstLetter } from '@/utils/helpers'

type Props = WithAuthProps &
  Pick<
    FormattedService,
    'examples' | 'name' | 'description' | 'summaryDescription' | 'category'
  > & {
    displayName: string
    features: FeatureItem[]
    requestSchema: SchemaObject
    response: Record<string, unknown>
  }

export const getServerSideProps = withAuth(async context => {
  try {
    const {
      category,
      schemas,
      description,
      display_name,
      examples,
      endpoints,
      pricing,
      name: apiName,
      summaryDescription,
    } = await fetchSingleService(
      (context.params!.api as string).toLocaleLowerCase(),
    )

    const [{ name }] = endpoints
    const endpointName = getEndpointName(name)
    const [example] = examples[lowercaseFirstLetter(endpointName)]

    return {
      props: {
        category,
        displayName: display_name,
        description,
        user: context.req.user,
        features: createFeaturesTableData({ endpoints, schemas, pricing }),
        examples,
        name: apiName,
        requestSchema: schemas[`${endpointName}Request`],
        summaryDescription,
        response: example.response,
      },
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
})

const Overview: NextPage<Props> = ({
  category,
  description,
  displayName,
  examples,
  user,
  features,
  name,
  requestSchema,
  response,
  summaryDescription,
}) => {
  return (
    <ApiLayout
      displayName={displayName}
      user={user}
      name={name}
      summaryDescription={summaryDescription}
      category={category}>
      <div className="">
        <div className="col-span-2 mb-6">
          <div className="pb-6 max-w-2xl my-4 md:my-8">
            <SubTitle>Introduction</SubTitle>
            <OverviewDescription>{description}</OverviewDescription>
          </div>
          <Features features={features} serviceName={name} />
          <Example
            examples={examples}
            apiName={name}
            requestSchema={requestSchema}
          />
          <ResponseBlock code={JSON.stringify(response, null, 4)} />
        </div>
      </div>
    </ApiLayout>
  )
}

export default Overview
