import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchApps, useDeleteApp, useUpdateApp } from '@/hooks'
import { LinkButton, Button, Spinner } from '@/components/ui'
import { App } from '@/components/pages/Cloud'

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
  const { data, isLoading } = useFetchApps()
  const deleteMutation = useDeleteApp()
  const updateMutation = useUpdateApp()

  function renderApps() {
    return (
      <div className="grid gap-6 mt-8">
        {data!.map(app => (
          <App
            {...app}
            key={app.id}
            buttons={
              <div className="w-full border-t pt-4 tbc mt-4 lg:mt-0 lg:border-0 lg:pt-0">
                <Button
                  className="w-full text-sm mb-4"
                  onClick={() => updateMutation.mutate(app.name!)}
                  loading={updateMutation.isLoading}>
                  Update
                </Button>
                <Button
                  className="w-full text-sm"
                  onClick={() => deleteMutation.mutate(app.name!)}
                  loading={deleteMutation.isLoading}>
                  Delete
                </Button>
              </div>
            }
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-6">Apps</h1>
            </div>
            <LinkButton href="/cloud/apps/add">Add</LinkButton>
          </div>
          {isLoading ? <Spinner /> : renderApps()}
        </div>
      </DashboardLayout>
    </>
  )
}
