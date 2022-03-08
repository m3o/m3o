import type { DeployRequest } from 'm3o/function'
import type { AddFunctionFormValues } from '@/types'
import { NextSeo } from 'next-seo'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { AuthCookieNames } from '@/lib/constants'
import { useM3OClient } from '@/hooks'
import { BackButtonLink, Button, TextInput, Select } from '@/components/ui'
import { createApiClient } from '@/lib/api-client'
import {
  AddFunctionForm,
  EnvironmentVariablesForm,
} from '@/components/pages/Cloud'

interface Props {
  runtimes: string[]
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

  const [{ regions = [] }, { runtimes = [] }] = await Promise.all([
    m3o.function.regions({}),
    m3o.function.runtimes({}),
  ])

  return {
    props: {
      runtimes,
      regions,
      user: req.user,
    } as Props,
  }
})

export default function CloudAddFunction({ regions, runtimes }: Props) {
  const router = useRouter()
  const m3o = useM3OClient()
  const formMethods = useForm<DeployRequest>()

  const addMutation = useMutation(
    (values: AddFunctionFormValues) => {
      const envVars = values.env_vars.reduce((obj, { key, value }) => {
        return { ...obj, [key]: value }
      }, {})

      return m3o.function.deploy({
        ...values,
        env_vars: envVars,
      })
    },
    {
      onSuccess: () => {
        router.push('/cloud/functions')
      },
    },
  )

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <BackButtonLink href="/cloud/functions">
            Back to functions
          </BackButtonLink>
          <h1 className="text-4xl font-bold mb-6">Add Function</h1>
          <div className="max-w-3xl">
            <FormProvider {...formMethods}>
              <form
                onSubmit={formMethods.handleSubmit((values: DeployRequest) =>
                  addMutation.mutate(values as AddFunctionFormValues),
                )}>
                <h2 className="font-bold text-xl my-10">Configuration</h2>
                <AddFunctionForm regions={regions} runtimes={runtimes} />
                <h2 className="font-bold text-xl my-10">
                  Environment Variables
                </h2>
                <EnvironmentVariablesForm />
                <Button
                  className="mt-6 text-sm self-start"
                  type="submit"
                  loading={addMutation.isLoading}>
                  Complete
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
