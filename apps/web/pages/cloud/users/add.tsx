import { NextSeo } from 'next-seo'
import type { Account } from 'm3o/user'
import { DashboardLayout } from '@/components/layouts'
import { useForm, Controller } from 'react-hook-form'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { TextInput } from '@/components/ui'

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

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="px-8 py-8 border-b tbc flex justify-between items-center">
          <h1 className="text-3xl font-bold">Add User</h1>
        </div>
        <div className="p-10">
          <form className="max-w-lg">
            <h2 className="mt-6 font-bold">Details</h2>
            <Controller
              control={control}
              name="email"
              defaultValue=""
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Email"
                  className="my-6"
                  placeholder="e.g john@smith.me"
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              defaultValue=""
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Password"
                  className="mb-6"
                  type="password"
                />
              )}
            />
            {/* <div className="flex justify-between items-center">
          <h2 className="mt-6 font-bold mb-6">Extra Details</h2>
          <button
            className="p-2 rounded-full bg-indigo-600"
            onClick={() => setAddProfileField(true)}
          >
            <PlusIcon className="w-4" />
          </button>
        </div> */}
            <button className="btn" type="submit">
              Submit
            </button>
          </form>
        </div>
      </DashboardLayout>
    </>
  )
}
