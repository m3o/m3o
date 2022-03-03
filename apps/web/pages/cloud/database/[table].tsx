import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchDbTableData } from '@/hooks'
import { DatabaseTable } from '@/components/pages/Cloud'

type DatabaseItem = Record<string, unknown> & { id: string }

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
  const router = useRouter()
  const { data, isFetching } = useFetchDbTableData(router.query.table as string)

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <DatabaseTable rows={data as DatabaseItem[]} />
      </DashboardLayout>
    </>
  )
}
