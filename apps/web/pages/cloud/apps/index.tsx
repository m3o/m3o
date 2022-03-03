import { NextSeo } from 'next-seo'
import { MainLayout, DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchApps } from '@/hooks'
import { App, AppMenu } from '@/components/pages/Cloud'

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
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold mb-6">Apps</h1>
          <h2>For more information on how M3O apps work</h2>
          <div className="grid gap-6 mt-8">
            {data!.map(app => (
              <App
                {...app}
                key={app.id}
                headerRight={
                  <AppMenu
                    handleButtonClick={console.log}
                    handleClose={console.log}
                    handleDeleteClick={console.log}
                    handleUpdateClick={console.log}
                    isOpen={false}
                  />
                }
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
