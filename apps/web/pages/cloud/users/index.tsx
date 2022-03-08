import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { LinkButton, Spinner } from '@/components/ui'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchUsers, useDeleteUsers } from '@/hooks'
import { UsersTable } from '@/components/pages/Cloud'

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

export default function CloudUsers() {
  const { data, isLoading } = useFetchUsers()
  const deleteUsersMutation = useDeleteUsers()

  function handleUserDeleteClick(items: string[]) {
    const message =
      items.length === 1
        ? 'Are you sure you would like to delete this user?'
        : `Are you sure you would like to delete these ${items.length} users?`

    if (window.confirm(message)) {
      deleteUsersMutation.mutate(items)
    }
  }

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="py-4 px-8 border-b tbc flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users</h1>
          <LinkButton href="/cloud/users/add" className="text-sm">
            Add User
          </LinkButton>
        </div>
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <Spinner />
          </div>
        ) : (
          <UsersTable
            users={data as any}
            handleUserDeleteClick={handleUserDeleteClick}
          />
        )}
      </DashboardLayout>
    </>
  )
}
