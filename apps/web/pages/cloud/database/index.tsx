import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchDbTables } from '@/hooks'
import { DatabaseTableItem } from '@/components/pages/Cloud'
import { Spinner } from '@/components/ui'

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
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold mb-6">Database</h1>
          <h2 className="mb-4">Please select table:</h2>
          {isFetching ? (
            <Spinner />
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
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
