import type { DeployRequest } from 'm3o/function'
import type { AddFunctionFormValues } from '@/types'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useForm, FormProvider } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { AuthCookieNames } from '@/lib/constants'
import { useM3OClient } from '@/hooks'
import { createApiClient } from '@/lib/api-client'

interface Props {
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

  return {
    props: {
      user: req.user,
    } as Props,
  }
})

export default function CloudAddFunction() {
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
      <NextSeo {...seo.cloud.functions.add} />
      <DashboardLayout>
        Add
        <Link href="/cloud/functions/add/source">
          <a>Write functions in the browser</a>
        </Link>
        <Link href="/cloud/functions/add/repo">
          <a>Upload functions from your Github repo</a>
        </Link>
        {/* <div className="p-6 md:p-10">
          <BackButtonLink href="/cloud/functions">
            Back to functions
          </BackButtonLink>
          <h1 className="text-3xl font-medium mb-6 gradient-text">
            Add Function
          </h1>
          <div className="max-w-3xl">
            <FormProvider {...formMethods}>
              <form
                onSubmit={formMethods.handleSubmit((values: DeployRequest) =>
                  addMutation.mutate(values as AddFunctionFormValues),
                )}>
                <AddFunctionForm regions={regions} runtimes={runtimes} />
                <p className="text-sm mb-4">Environment Variables</p>
                <EnvironmentVariablesForm />
                <div>
                  <Button
                    className="mt-6 text-sm"
                    type="submit"
                    loading={addMutation.isLoading}>
                    Deploy
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div> */}
      </DashboardLayout>
    </>
  )
}
