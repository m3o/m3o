import type { Service } from 'm3o/app'
import type { Column } from 'react-table'
import Link from 'next/link'
import { useMemo } from 'react'
import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchApps } from '@/hooks'
import { LinkButton, Spinner } from '@/components/ui'
import { Table, Status, AppStatus } from '@/components/pages/Cloud'

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

export default function CloudApps() {
  const { data, isLoading } = useFetchApps()

  type RequiredService = Required<Service>

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
    return (
      <div className="grid gap-6 mt-8">
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
      <NextSeo {...seo.about} />
      <DashboardLayout>
        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Apps</h1>
            <LinkButton href="/cloud/apps/add" className="text-sm">
              Add
            </LinkButton>
          </div>
        </div>
        {isLoading ? <Spinner /> : renderApps()}
      </DashboardLayout>
    </>
  )
}
