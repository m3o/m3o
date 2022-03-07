import type { RunRequest } from 'm3o/app'
import type { AddAppFormValues } from '@/types'
import { NextSeo } from 'next-seo'
import { useForm, FormProvider } from 'react-hook-form'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { AuthCookieNames } from '@/lib/constants'
import { useRunApp } from '@/hooks'
import { BackButtonLink } from '@/components/ui'
import {
  EnvironmentVariablesForm,
  AppDetailsForm,
} from '@/components/pages/Cloud'

interface Props {
  regions: string[]
  user: Account
}

export const getServerSideProps = withAuth(async ({ req }) => {
  if (!req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  const response = await fetch('https://api.m3o.com/v1/app/Regions', {
    headers: {
      Authorization: `Bearer ${req.cookies[AuthCookieNames.ApiToken]}`,
    },
  })

  const { regions } = (await response.json()) as { regions: string[] }

  return {
    props: {
      regions,
      user: req.user,
    } as Props,
  }
})

export default function CloudAddApp({ regions }: Props) {
  const formMethods = useForm<RunRequest>()
  const runAppMutation = useRunApp()

  const handleSubmit = (values: AddAppFormValues) => {
    console.log(values)
  }

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <BackButtonLink href="/cloud/apps">Back to apps</BackButtonLink>
          <h1 className="text-4xl font-bold mb-6">Add App</h1>
          <div className="max-w-3xl">
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
                <h2 className="font-bold text-xl my-10">Configuration</h2>
                <AppDetailsForm regions={regions} />
                <h2 className="font-bold text-xl my-10">
                  Environment Variables
                </h2>
                <EnvironmentVariablesForm />
              </form>
            </FormProvider>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
