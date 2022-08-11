import type { RunRequest } from 'm3o/app'
import type { AddAppFormValues } from '@/types'
import { NextSeo } from 'next-seo'
import { useForm, FormProvider } from 'react-hook-form'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { AuthCookieNames } from '@/lib/constants'
import { useRunApp } from '@/hooks'
import { BackButtonLink, Button } from '@/components/ui'
import {
  EnvironmentVariablesForm,
  AppDetailsForm,
} from '@/components/pages/Admin'
import { createApiClient } from '@/lib/api-client'

interface Props {
  regions: string[]
  user: Account
}

export const getServerSideProps = withAuth(async ({ req }) => {
  const m3o = createApiClient(req.cookies[AuthCookieNames.ApiToken])

  if (!req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  const response = await m3o.app.regions({})

  return {
    props: {
      regions: response.regions || [],
      user: req.user,
    } as Props,
  }
})

export default function CloudAddApp({ regions }: Props) {
  const formMethods = useForm<RunRequest>()
  const runAppMutation = useRunApp()

  // TODO: come back and fix this.
  const handleSubmit = (values: any) => {
    const hack = values as AddAppFormValues

    const envVars = hack.env_vars.reduce((obj, { key, value }) => {
      return { ...obj, [key]: value }
    }, {})

    runAppMutation.mutate({
      ...values,
      env_vars: envVars,
    })
  }

  return (
    <>
      <NextSeo {...seo.admin.apps.add} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <BackButtonLink href="/admin/apps">Back to apps</BackButtonLink>
          <h1 className="text-3xl font-medium mb-6 gradient-text">Add App</h1>
          <div className="max-w-3xl">
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
                <AppDetailsForm regions={regions} />
                <p className="text-sm mb-4">Environment Variables</p>
                <EnvironmentVariablesForm />
                <div className="border-t tbc">
                  <Button
                    className="mt-6 text-sm self-start"
                    type="submit"
                    loading={runAppMutation.isLoading}>
                    Run
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
