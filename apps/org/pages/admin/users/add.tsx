import { NextSeo } from 'next-seo'
import type { Account } from 'm3o/user'
import { DashboardLayout } from '@/components/layouts'
import { useForm, Controller } from 'react-hook-form'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { TextInput, Alert, BackButtonLink } from '@/components/ui'
import { useAddUser } from '@/hooks'

interface CreateUserFields extends Account {
  password: string
}

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

export default function CloudAddUser() {
  const { control, handleSubmit } = useForm<CreateUserFields>()
  const addUserMutation = useAddUser()

  function onSubmit(values: CreateUserFields) {
    addUserMutation.mutate(values)
  }

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <BackButtonLink href="/admin/users">Back to Users</BackButtonLink>
          <h1 className="text-3xl font-medium mb-6 gradient-text">Add User</h1>
          {addUserMutation.error && (
            <Alert type="error" className="mb-8">
              {addUserMutation.error as string}
            </Alert>
          )}
          <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="email"
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'Please provide an email address for this user',
                },
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Please provide a valid email address',
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Email"
                  className="my-4"
                  placeholder="e.g john@smith.me"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'Please provide a password',
                },
                minLength: {
                  value: 8,
                  message:
                    'Please provide a password with 8 characters or more',
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Password"
                  type="password"
                  error={fieldState.error?.message}
                />
              )}
            />
            <button className="btn" type="submit">
              Submit
            </button>
          </form>
        </div>
      </DashboardLayout>
    </>
  )
}
