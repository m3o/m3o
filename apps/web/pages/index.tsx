import type { ReactElement } from 'react'
import { NextSeo } from 'next-seo'
import seo from '@/lib/seo.json'
import { Landing } from '@/components/ui'
import { LoggedInView } from '@/components/pages/Home'
import { WithAuthProps, withAuth } from '@/lib/api/m3o/withAuth'
import { exploreServices } from '@/lib/api/m3o/services/explore'
import { AuthCookieNames } from '@/lib/constants'

interface Props extends WithAuthProps {
  apiToken: string
  services: ExploreAPI[]
}

const SERVICES_NAMES = [
  'ai',
  'app',
  'cache',
  'db',
  'event',
  'user'
]

export const getServerSideProps = withAuth(async context => {
  const services = await exploreServices()

  return {
    props: {
      apiToken: context.req.cookies[AuthCookieNames.ApiToken] || '',
      services: SERVICES_NAMES.map(name =>
        services.find(item => item.name === name),
      ),
      user: context.req.user,
    } as Props,
  }
})

export default function Home({
  apiToken,
  services,
  user,
}: Props): ReactElement {
  return (
    <>
      <NextSeo
        title={user ? seo.home.title : seo.landing.title}
        description={user ? seo.home.description : seo.landing.description}
        canonical="https://m3o.com"
      />
      {user ? (
        <LoggedInView user={user} apiToken={apiToken} />
      ) : (
        <Landing
          heading="Universal Micro Services"
          services={services}
          subHeading="Explore the cloud as serverless building blocks"
        />
      )}
    </>
  )
}
