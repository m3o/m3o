import type { Service } from 'm3o/app'
import type { Column } from 'react-table'
import Link from 'next/link'
import { useMemo } from 'react'
import { NextSeo } from 'next-seo'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { useFetchApps, useDeleteApp, useUpdateApp } from '@/hooks'
import { LinkButton, Button, Spinner } from '@/components/ui'
import { Table } from '@/components/pages/Cloud'

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
  const deleteMutation = useDeleteApp()
  const updateMutation = useUpdateApp()

  type RequiredService = Required<Service>

  const columns = useMemo<Column<RequiredService>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }) => (
          <Link href={`/cloud/apps/${row.original.name}`}>{value}</Link>
        ),
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
            <LinkButton href="/cloud/apps/add">Add</LinkButton>
          </div>
          {isLoading ? <Spinner /> : renderApps()}
        </div>
      </DashboardLayout>
    </>
  )
}
