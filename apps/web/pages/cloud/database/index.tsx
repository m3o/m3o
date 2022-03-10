import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchDbTables } from '@/hooks'
import { DatabaseTableItem } from '@/components/pages/Cloud'
import { Spinner, LinkButton } from '@/components/ui'

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

export default function CloudDatabase() {
  const { data, isFetching } = useFetchDbTables()

  return (
    <>
      <NextSeo {...seo.cloud.functions.main} />
      <DashboardLayout>
        <div className="p-6 border-b tbc flex items-center justify-between">
          <h1 className="text-3xl font-medium gradient-text">Database</h1>
          <LinkButton href="/cloud/database/add" className="text-sm">
            Add
          </LinkButton>
        </div>
        <div className="p-6">
          <h2 className="mb-4">Please select table:</h2>
          {isFetching ? (
            <Spinner />
          ) : (
            <div className="grid gap-4 max-w-lg">
              {data!.map(item => (
                <DatabaseTableItem name={item} key={item} />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}
