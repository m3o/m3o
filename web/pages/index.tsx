import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import seo from '@/lib/seo.json'
import { MainLayout } from '@/components/layouts'
import { WithAuthProps } from '@/lib/api/m3o/withAuth'
import {
  Explore,
  ExploreHeader,
  ExploreProps,
  exploreGetServerSideProps,
} from '@/components/ui'

export const getServerSideProps = exploreGetServerSideProps

const Home: NextPage<ExploreProps & WithAuthProps> = ({
  user,
  ...exploreProps
}) => {
  return (
    <>
      <NextSeo
        title={user ? seo.home.title : seo.landing.title}
        description={user ? seo.home.description : seo.landing.description}
        canonical="https://m3o.com"
      />
      <MainLayout>
        <Explore {...exploreProps} header={<ExploreHeader title="M3O Services" />} />
      </MainLayout>
    </>
  )
}

export default Home
