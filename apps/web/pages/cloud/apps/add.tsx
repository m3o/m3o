import type { RunRequest } from 'm3o/app'
import { NextSeo } from 'next-seo'
import { useForm, Controller } from 'react-hook-form'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { AuthCookieNames } from '@/lib/constants'
import { useRunApp } from '@/hooks'
import { TextInput, Select, BackButtonLink } from '@/components/ui'

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
  const runAppMutation = useRunApp()
  const { handleSubmit, control } = useForm<RunRequest>()

  function onSubmit(values: RunRequest) {
    runAppMutation.mutate(values)
  }

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <BackButtonLink href="/cloud/apps">Back to apps</BackButtonLink>
          <h1 className="text-4xl font-bold mb-6">Add App</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl pt-6">
            <Controller
              control={control}
              defaultValue=""
              name="name"
              rules={{
                required: {
                  value: true,
                  message: 'Please provide your apps name',
                },
                pattern: {
                  value: /^\S+$/,
                  message: 'Please enter a name without spaces',
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Name"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="repo"
              defaultValue=""
              rules={{ required: 'Please provide a repo' }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Repo"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="port"
              rules={{ required: 'Please provide a port number' }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Port"
                  type="number"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="branch"
              rules={{ required: 'Please provide a branch' }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Branch"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="region"
              rules={{ required: 'Please select a region' }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label="Region"
                  error={fieldState.error?.message}
                  options={regions.map(region => ({
                    name: region,
                    value: region,
                  }))}
                />
              )}
            />
            <button type="submit" className="btn mt-10">
              Submit
            </button>
          </form>
        </div>
      </DashboardLayout>
    </>
  )
}
