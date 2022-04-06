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
  'ip',
  'weather',
  'nft',
  'function',
  'app',
  'user',
  'db',
  'email',
  'space',
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
        title={seo.home.title}
        description={seo.home.description}
        canonical="https://m3o.com"
      />
      {user ? (
        <LoggedInView user={user} apiToken={apiToken} />
      ) : (
        <Landing
          heading="Everything as a Service"
          services={services}
          subHeading="Explore, discover and consume public APIs as simpler programmable
          building blocks all on one platform for a 10x developer experience."
        />
      )}
    </>
  )
}
