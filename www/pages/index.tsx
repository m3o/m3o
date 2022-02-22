/* eslint @next/next/no-img-element: 0 */
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import seo from '@/lib/seo.json'
import { MainLayout } from '@/components/layouts'
import {
  Banner,
  SubscribeSection,
  WhatIsM3O,
  HowToGetStarted,
  CloudBanner,
  Pricing,
  LoggedInView,
} from '@/components/pages/Home'
import { ServicesGrid } from '@/components/ui'
import { WithAuthProps, withAuth } from '@/lib/api/m3o/withAuth'
import { exploreServices } from '@/lib/api/m3o/services/explore'
import { AuthCookieNames } from '@/lib/constants'

interface Props extends WithAuthProps {
  apiToken: string
  services: ExploreAPI[]
}

const SERVICES_NAMES = [
  'app',
  'user',
  'db',
  'function',
  'event',
  'sms',
  'email',
  'search',
  'space',
]

export const getServerSideProps = withAuth(async context => {
  const services = await exploreServices()

  return {
    props: {
      apiToken: context.req.cookies[AuthCookieNames.ApiToken] || '',
      services: services.filter(service =>
        SERVICES_NAMES.includes(service.name),
      ),
      user: context.req.user,
    } as Props,
  }
})

const Home: NextPage<Props> = ({ apiToken, services, user }) => {
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
        <MainLayout>
          <Banner />
          <WhatIsM3O>
            <ServicesGrid services={services} />
          </WhatIsM3O>
          <HowToGetStarted />
          <Pricing />
          <CloudBanner />
          <SubscribeSection />
        </MainLayout>
      )}
    </>
  )
}

export default Home
