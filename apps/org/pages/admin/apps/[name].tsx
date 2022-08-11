import type { Service } from 'm3o/app'
import type { ReactElement } from 'react'
import { Status, AppStatus } from '@/components/pages/Admin'
import { NextSeo } from 'next-seo'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { BackButtonLink, Button, Tabs } from '@/components/ui'
import { AuthCookieNames } from '@/lib/constants'
import { createApiClient } from '@/lib/api-client'
import { Logs } from '@/components/pages/Admin'
import { useFetchSingleApp, useUpdateApp, useDeleteApp } from '@/hooks'

interface Props {
  app: Service
  user: Account
}

export const getServerSideProps = withAuth(async context => {
  const m3o = createApiClient(context.req.cookies[AuthCookieNames.ApiToken])

  if (!context.req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  const response = await m3o.app.status({
    name: context.params!.name as string,
  })

  return {
    props: {
      app: response.service,
      user: context.req.user,
    } as Props,
  }
})

const APP_FIELDS: (keyof Service)[] = ['name', 'id', 'branch', 'port', 'repo']

export default function CloudApp({ app }: Props): ReactElement {
  const { data = {} } = useFetchSingleApp(app)
  const environmentVariables = data.env_vars || {}
  const updateAppMutation = useUpdateApp(app.name!)
  const deleteAppMutation = useDeleteApp(app.name!)

  return (
    <>
      <NextSeo title={`${seo.admin.apps.main.title} - ${app.name}`} />
      <DashboardLayout>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <BackButtonLink href="/admin/apps">Back to apps</BackButtonLink>
          <div className="md:grid grid-cols-4 ">
            <div className="col-span-3">
              <h1 className="font-bold text-3xl mb-2">{data.name}</h1>
              <p>
                <a href={data.url} className="flex items-center mb-4">
                  {data.url} <ExternalLinkIcon className="w-4 ml-1" />
                </a>
              </p>
              <Status status={data.status as AppStatus} />
            </div>
            <div className="mt-6 md:mt-0">
              <Button
                className="text-sm w-full mb-2"
                onClick={() => updateAppMutation.mutate()}
                loading={updateAppMutation.isLoading}>
                Update
              </Button>
              <Button
                className="text-sm w-full"
                onClick={() => deleteAppMutation.mutate()}
                loading={deleteAppMutation.isLoading}>
                Delete
              </Button>
            </div>
          </div>
          <div className="mt-10">
            <Tabs>
              <div title="Overview" className="pt-6 text-sm">
                {APP_FIELDS.map(key => (
                  <div
                    key={key}
                    className="grid grid-cols-2 even:bg-zinc-50 even:dark:bg-zinc-800 rounded-md w-full">
                    <p className="capitalize font-medium p-4">{key}</p>
                    <p className="p-4 overflow-hidden text-ellipsis">
                      {app[key]}
                    </p>
                  </div>
                ))}
                {!!Object.keys(environmentVariables).length && (
                  <>
                    <h2 className="font-bold mt-10">Environment Variables</h2>
                    <div className="mt-6 text-sm">
                      {Object.keys(environmentVariables).map(key => (
                        <div
                          key={key}
                          className="grid grid-cols-2 even:bg-zinc-50 even:dark:bg-zinc-800">
                          <p className="capitalize font-medium p-4 text-sm">
                            {key}
                          </p>
                          <p className="p-4 ">{environmentVariables[key]}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div title="Logs">
                <Logs appName={app.name!} />
              </div>
            </Tabs>
          </div>
        </div>
        <aside className="mt-10"></aside>
      </DashboardLayout>
    </>
  )
}
