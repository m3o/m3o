import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { DatabaseTable } from '@/components/pages/Cloud'
import { useFetchDbTableData, useM3OClient } from '@/hooks'
import { Button, FullSpinner } from '@/components/ui'
import { QueryKeys } from '@/lib/constants'

type DatabaseItem = Record<string, unknown> & { id: string }

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

export default function CloudDatabaseTable() {
  const queryClient = useQueryClient()
  const m3o = useM3OClient()
  const router = useRouter()
  const tableName = router.query.table as string

  const dropTableMutation = useMutation(
    () => m3o.db.dropTable({ table: tableName }),
    {
      onSuccess: () => {
        router.push('/cloud/database')
        queryClient.invalidateQueries(QueryKeys.CloudDatabaseTables)
      },
    },
  )

  const { data, isLoading } = useQuery(
    [QueryKeys.CloudDatabaseTables, tableName],
    async () => {
      const response = await m3o.db.read({ table: tableName, limit: 1000 })
      return response.records || []
    },
  )

  function handleDropTableClick() {
    if (window.confirm('Are you sure you would like to drop this table?')) {
      dropTableMutation.mutate()
    }
  }

  return (
    <>
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 border-b tbc flex items-center justify-between">
          <h1 className="text-2xl font-medium gradient-text flex items-center">
            <Link href="/cloud/database">
              <a className="ttc">
                <ArrowLeftIcon className="w-4 mr-4" />
              </a>
            </Link>
            {router.query.table}
          </h1>
          <Button className="text-sm" onClick={handleDropTableClick}>
            Drop Table
          </Button>
        </div>
        {isLoading ? (
          <FullSpinner />
        ) : (
          <DatabaseTable rows={data as DatabaseItem[]} />
        )}
      </DashboardLayout>
    </>
  )
}
