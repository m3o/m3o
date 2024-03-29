import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchDbTables } from '@/hooks'
import { DatabaseTableItem } from '@/components/pages/Admin'
import { Spinner, LinkButton } from '@/components/ui'

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: '/login',
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
      <NextSeo {...seo.cloud.database.main} />
      <DashboardLayout>
        <div className="px-6 py-4 border-b tbc flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-medium">
            Database
          </h1>
          {/* <LinkButton href="/admin/database/add" className="text-sm">
            Add
          </LinkButton> */}
        </div>
        <div className="p-6">
          <h2 className="mb-4">Tables</h2>
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
