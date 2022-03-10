import type { Service } from 'm3o/app'
import type { Column } from 'react-table'
import { useQuery } from 'react-query'
import Link from 'next/link'
import { useMemo } from 'react'
import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '@/hooks'
import { LinkButton, FullSpinner } from '@/components/ui'
import {
  Table,
  Status,
  AppStatus,
  NoServiceResults,
} from '@/components/pages/Cloud'

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

type RequiredService = Required<Service>

export default function CloudApps() {
  const m3o = useM3OClient()

  const { data, isLoading } = useQuery(
    QueryKeys.CloudApps,
    async () => {
      const response = await m3o.app.list({})
      return response.services || []
    },
    {
      refetchInterval: 5000,
    },
  )

  const columns = useMemo<Column<RequiredService>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }) => {
          if (row.original.status !== 'Deleting') {
            return (
              <Link href={`/cloud/apps/${row.original.name}`}>{value}</Link>
            )
          }

          return value
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <Status status={value as AppStatus} />,
      },
      {
        Header: 'Port',
        accessor: 'port',
      },
      {
        Header: 'Repo',
        accessor: 'repo',
      },
      {
        Header: 'Branch',
        accessor: 'branch',
      },
      {
        Header: 'Region',
        accessor: 'region',
      },
      {
        Header: 'URL',
        accessor: 'url',
        Cell: ({ value }) => <a href={value}>{value}</a>,
      },
    ],
    [],
  )

  function renderApps() {
    if (data?.length === 0) {
      return <NoServiceResults serviceName="apps" startLink="/cloud/apps/add" />
    }

    return (
      <div className="grid gap-6">
        <Table<RequiredService>
          allowSelection={false}
          data={data! as RequiredService[]}
          onTrashClick={console.log}
          columns={columns}
        />
      </div>
    )
  }

  return (
    <>
      <NextSeo {...seo.cloud.apps.main} />
      <DashboardLayout>
        <div className="p-6 border-b tbc">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-medium gradient-text">Apps</h1>
            {!!data?.length && (
              <LinkButton href="/cloud/apps/add" className="text-sm">
                Add
              </LinkButton>
            )}
          </div>
        </div>
        {isLoading ? <FullSpinner /> : renderApps()}
      </DashboardLayout>
    </>
  )
}
