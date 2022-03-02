import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchDbTables } from '@/hooks'

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

export default function CloudDatabaseTable() {
  const { data, isFetching } = useFetchDbTables()

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>Table</DashboardLayout>
    </>
  )
}
