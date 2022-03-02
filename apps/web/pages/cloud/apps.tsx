import { NextSeo } from 'next-seo'
import { MainLayout, DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchApps } from '@/hooks'

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  return {
    props: {
      user: context.req.user,
    },
  }
})

export default function CloudApps() {
  const { data, isFetching } = useFetchApps()

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <h1 className="text-4xl font-bold mb-6">Apps</h1>
        <h2>For more information on how M3O apps work</h2>
      </DashboardLayout>
    </>
  )
}
