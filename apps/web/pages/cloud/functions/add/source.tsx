import type { DeployResponse, Func } from 'm3o/function'
import { NextSeo } from 'next-seo'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { AuthCookieNames } from '@/lib/constants'
import { useM3OClient } from '@/hooks'
import { createApiClient } from '@/lib/api-client'
import { FunctionCreateFromSource } from '@/components/pages/Cloud'

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

export default function CloudAddFunctionFromSource() {
  const router = useRouter()
  const m3o = useM3OClient()

  const createMutation = useMutation<DeployResponse, ApiError, Func, void>(
    values => {
      // const envVars = values.env_vars.reduce((obj, { key, value }) => {
      //   return { ...obj, [key]: value }
      // }, {})

      return m3o.function.deploy({
        ...values,
        // env_vars: envVars,
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
        <FunctionCreateFromSource
          onSubmit={values => createMutation.mutate(values)}
        />
      </DashboardLayout>
    </>
  )
}
