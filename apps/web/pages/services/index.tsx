import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import seo from '@/lib/seo.json'
import { DashboardLayout } from '@/components/layouts'
import { WithAuthProps } from '@/lib/api/m3o/withAuth'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { fetchCategories } from '@/lib/api/m3o/services/explore'
import { searchServices } from '@/lib/api/m3o/services/explore'
import { Routes } from '@/lib/constants'

import {
  Explore,
  ExploreHeader,
  ExploreProps,
} from '@/components/ui'

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: Routes.Home,
        permanent: false,
      },
    }
  }

  const categories = await fetchCategories()
  const services = await searchServices(context.query.search as string, [])

  return {
    props: {
      route: '/services',
      categories,
      initialSearchTerm: context.query.search || '',
      services,
      user: context.req.user,
    } as Omit<ExploreProps, 'header'>,
  }
})

const ServicesPage: NextPage<ExploreProps & WithAuthProps> = ({
  user,
  ...exploreProps
}) => {
  return (
    <>
      <NextSeo
        title={seo.services.title}
        description={seo.services.description}
        canonical="https://m3o.com/services"
      />
      <DashboardLayout>
        <Explore {...exploreProps} header={<ExploreHeader title="Services" route="/services" />} />
      </DashboardLayout>
    </>
  )
}

export default ServicesPage
