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
      <div className="md:grid md:grid-cols-2 min-h-screen api-max-width">
        <div className="pb-6 mt-10 md:pr-6">
          <CategoryBubble className="inline-block mb-6">
            {category}
          </CategoryBubble>
          <h1 className="font-medium text-4xl md:text-5xl mb-4 text-white">
            {displayName}
          </h1>
          <p className="pb-6 text-lg text-zinc-700 dark:text-zinc-400 font-light mb-4">
            {summaryDescription.split('#')[0]}
          </p>
          <h2 className="text-white text-xl mb-4 font-bold">Introduction</h2>
          <div className="max-w-lg">
            <OverviewDescription>{description}</OverviewDescription>
          </div>
          <h2 className="text-white text-xl mb-4 mt-10 font-bold">Endpoints</h2>
          {features.map(feature => (
            <div className="mb-5">
              <h3>
                <a
                  href={`/${name}/api#${feature.title.replace(/ /g, '')}`}
                  className="mb-1 inline-block ">
                  {feature.title}
                </a>
              </h3>
              <p className="text-zinc-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <LinkButton
            href="/login"
            className="block md:float-right mb-10 order-1 text-center mt-10 md:order-0 md:inline-block md:ml-auto">
            Get Started
          </LinkButton>
          <div className="md:order-1">
            <h2 className="text-white text-xl mb-6 font-bold md:hidden">
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
