import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import seo from '@/lib/seo.json'
import { MainLayout } from '@/components/layouts'
import { WithAuthProps, withAuth } from '@/lib/api/m3o/withAuth'
import { Explore, ExploreHeader, ExploreProps } from '@/components/ui'
import { fetchCategories, searchServices } from '@/lib/api/m3o/services/explore'

export const getServerSideProps = withAuth(async context => {
  const [categories, services] = await Promise.all([
    fetchCategories(),
    searchServices('', [context.query.category as string]),
  ])

  return {
    props: {
      categories,
      initialSearchTerm: '',
      services,
      user: context.req.user,
    } as Omit<ExploreProps, 'header'>,
  }
})

const ExploreCategory: NextPage<ExploreProps & WithAuthProps> = ({
  user,
  ...exploreProps
}) => {
  return (
    <>
      <NextSeo
        title={seo.explore.title}
        description={seo.explore.description}
      />
      <MainLayout>
        <Explore {...exploreProps} header={<ExploreHeader title="Explore" />} />
      </MainLayout>
    </>
  )
}

export default ExploreCategory
