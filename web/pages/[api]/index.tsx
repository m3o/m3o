import type { NextPage } from 'next'
import Link from 'next/link'
import type { SchemaObject } from 'openapi3-ts'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'
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
  Navigation,
} from '@/components/pages/Api'
import {
  ResponseBlock,
  SubTitle,
  CategoryBubble,
  LinkButton,
} from '@/components/ui'
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
      quotas,
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
        features: createFeaturesTableData({ endpoints, schemas, pricing, quotas }),
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
      <div className="md:grid md:grid-cols-2 min-h-screen api-max-width">
        <div className="pb-6 mt-10 md:pr-6">
          <CategoryBubble className="inline-block mb-6">
            {category}
          </CategoryBubble>
          <h1 className="font-medium text-4xl md:text-5xl mb-4">
            {displayName}
          </h1>
          <p className="pb-6 text-lg font-light mb-4">
            {summaryDescription.split('#')[0]}
          </p>
          <h2 className="text-xl mb-4 font-bold">Introduction</h2>
          <div className="max-w-lg">
            <OverviewDescription>{description}</OverviewDescription>
          </div>
          <h2 className="text-xl mb-4 mt-10 font-bold">Features</h2>
          {features.map(feature => (
            <div className="mb-5">
              <h3>
                <a
                  href={`/${name}/api#${feature.title.replace(/ /g, '')}`}
                  className="mb-1 inline-block ">
                  {feature.title}
                </a>
              </h3>
              <p className="text-sm max-w-lg">{feature.description}</p>
            </div>
          ))}
          <h2 id="pricing" className="text-xl mb-4 mt-10 font-bold">Pricing</h2>
          <table className="w-10/12 mb-6">
            <thead className="mb-4">
              <tr>
                <th className="text-left font-normal">Endpoint</th>
                <th className="text-left font-normal">Per Request</th>
                {/* <th className="text-left font-normal">Quota</th> */}
              </tr>
            </thead>
            <tbody>
          {features.map(feature => (
              <tr className="border-t border-zinc-300">
                <td className="py-2 w-9/12 text-sm">{feature.title}</td>
                <td className="py-2 w-3/12 text-sm">{feature.price === 'Free' ? 'Base' : feature.price}</td>
                {/* <td className="py-2 w-2/12 text-sm">{feature.quota}</td> */}
              </tr>
          ))}
            </tbody>
          </table>
          <p className="text-zinc-600 text-sm max-w-lg">Base requests are 0.000001 USD</p>
        </div>
        <div className="flex flex-col">
          <div className="md:mt-20 md:order-1">
            <h2 className="text-xl mb-6 font-bold md:hidden">
              Example
            </h2>
            <Example
              examples={examples}
              apiName={name}
              requestSchema={requestSchema}
            />
            <ResponseBlock code={JSON.stringify(response, null, 4)} />
          </div>
        </div>
      </div>
    </ApiLayout>
  )
}

export default Overview
