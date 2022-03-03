import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
// import { LinkButton, Spinner } from '@/components/ui'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
// import { useFetchUsers } from '@/hooks'
// import { UsersTable } from '@/components/pages/Cloud'

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

export default function CloudFunctions() {
  // const { data, isFetching } = useFetchUsers()

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Functions</h1>
        </div>
      </DashboardLayout>
    </>
  )
}
