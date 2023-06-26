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

const ExplorePage: NextPage<ExploreProps & WithAuthProps> = ({
  user,
  ...exploreProps
}) => {
  return (
    <>
      <NextSeo
        title={seo.explore.title}
        description={seo.explore.description}
        canonical="https://m3o.com/explore"
      />
      <MainLayout>
        <Explore {...exploreProps} header={<ExploreHeader title="Explore Services" />} />
      </MainLayout>
    </>
  )
}

export default ExplorePage
